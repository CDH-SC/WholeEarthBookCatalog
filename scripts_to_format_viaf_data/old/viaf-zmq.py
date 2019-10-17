import argparse
import asyncio
import itertools
import csv
import mmap
import multiprocessing as mp
import msgpack
import os
import subprocess
import sys
import time
import zmq

from zmq.asyncio import Context

from cityhash import CityHash64
from lxml import etree
from itertools import zip_longest

# Load all the individual table files

def dataWriter(data, table_name):
    tables[table_name].writerows(data)


def loadTables(dirname):

    tlist = ["person","aliases","normNames","coAuthor","pub","isbns","countries","titles"]
    theaders = [["id","type", "name", "start", "dateType", "nationality"],
            ["id", "names"],
            ["id", "normName"],
            ["id", "id_2", "coAuth"],
            ["id", "pub_id", "publisher"],
            ["id", "isbn"],
            ["id", "country_id", "country"],
            ["id", "title_id", "title"]]

    return tlist, theaders, { x:csv.writer(open(os.path.join(dirname, "{}Table.tsv".format(x)), 'w'), delimiter='\t') for x in tlist }

# Queued function that handles all of the File IO
# All the results from XmlToTsv get sent here immediately after processing


async def yieldData(socket):
    context = Context()
    queue = context.socket(zmq.PULL)
    queue.connect("tcp://127.0.0.1:{}".format(5557+socket))
    while True:
        msg = await queue.recv()
        msg = msgpack.unpackb(msg, use_list=False, raw=False)
        yield msg

def splitTSVMem(outfile, dirname, header):

    # Construct a dictionary for country codes
    country_codes = {}
    with open("data/countryIDs.tsv","r") as f:
        csv_reader = csv.reader(f, delimiter="\t")
        country_codes = {country.strip():ID for ID,_,country,_ in csv_reader if ID != "ID"}

    # Increment from 300 for all non-valid country codes in the dataset
    country_id = 300
    with open(outfile, 'w') as write_handle:

        csv_writer = csv.writer(write_handle, delimiter="\t")
        csv_writer.writerow(header)

        # If the directory doesn't exist for split files, make it
        if not os.path.exists(dirname):
            os.makedirs(dirname)
            # Hack to satisfy provisioning scripts
            os.system("touch {}/.abc".format(dirname))

        global tables
        tlist, theaders, tables = loadTables(dirname)


        # Write headers to each individual TSV
        for tname,theader in zip(tlist, theaders):
            tables[tname].writerow(theader)

        # Just some performance testing 
        #is_list = isinstance(queue, list)
        is_list = False
        flag = True

        # While there is still more data to be recieved
        queues = []
        n_queues = 16
        for i in range(n_queues):
            queues.append(yieldData(i))
        counter = 0

        async def doWork():
            country_id = 300
            while len(queues) > 1:
                print(len(queues))

                s_time = time.time()
                # If list, you won't be getting any more data, so end after one loop
                # if is_list:
                #    flag = False
                #    rows = queue

                # else:
                    # Recieve data from queue

                rows = []
                
                # print("queue retrieval time: {}".format(time.time() - s_time))

                # All the data types
                for index, queue in enumerate(queues):
                    async for rows in queue:
                        if rows == "NONE":
                            del queues[index]
                            break

                        for row in rows:
                            csv_writer.writerow(row[:13])
                            pid, pType = row[0:2]
                            start, end, dType, nat = row[9:13]
                            coauthors = row[4]
                            publishers = row[5]
                            isbns = row[6]
                            titles = row[8]
                            countries = row[7]
                            coauthor_hashes = row[13]
                            publisher_hashes = row[14]
                            title_hashes = row[15]
                            name = row[2][0]

                            tables["person"].writerow((pid, pType, name, start, end, dType, nat))

                            # Rows look like VIAF_ID, UNIQUE_HASH NODE
                            # Three cols

                            for key,value in zip(coauthor_hashes, coauthors):
                                tables["coAuthor"].writerow((pid, key, value))
                            #tables["coAuthor"].writerows(((pid, key, value) for key,value in zip(coauthor_hashes, coauthors)))

                            for key,value in zip(publisher_hashes, publishers):
                                tables["pub"].writerow((pid, key, value))
                            # tables["pub"].writerows(((pid, key, value) for key,value in zip(publisher_hashes, publishers)))

                            for key,value in zip(title_hashes, titles):
                                tables["titles"].writerow((pid, key, value))
                            # tables["titles"].writerows((pid, key, value) for key,value in zip(title_hashes, titles))

                            for isbn in isbns:
                                tables["isbns"].writerow((pid, isbn))
                            # tables["isbns"].writerows(((pid, isbn) for isbn in isbns))

                            for alias in row[2]:
                                tables['aliases'].writerow((pid, alias))

                            for normname in row[3]:
                                tables['normNames'].writerow((pid, normname))

                            # Check if country code exists, if not, then increment from 300
                            for country in countries:
                                c_id = country_codes.get(country, None)
                                if c_id == None:
                                    c_id = country_id
                                    country_id += 1
                                    country_codes[country] = c_id
                                tables['countries'].writerow((pid, c_id, country)) 
                        # print("Loop Time: {}".format(time.time() - s_time))
        loop = asyncio.get_event_loop().run_until_complete(doWork())
        print("HERE")

def pushBind(socket):
      context = zmq.Context()
      ventilator_send = context.socket(zmq.PUSH)
      ventilator_send.bind("tcp://127.0.0.1:{}".format(socket))
      return context, ventilator_send

def pullBind(socket):
      context = zmq.Context()
      ventilator_recieve= context.socket(zmq.PULL)
      # print(socket)
      ventilator_recieve.connect("tcp://127.0.0.1:{}".format(socket))
      return context, ventilator_recieve

# Does the actual xml to tsv conversion
def xmlToTsv(out_socket, in_socket):
      pull_con, pull_sock = pullBind(in_socket)
      push_con, push_sock = pushBind(out_socket)
      # Read in one cluster at a time
      counter = 0
      while True:
          rows = []
          xml_strings = msgpack.unpackb(pull_sock.recv(), use_list=False, raw=False)
          if xml_strings == "NONE":
              break

          counter += 1
          for xml_string in xml_strings:
              try:
                cluster = etree.fromstring(xml_string)
              except:
                continue

              cluster = etree.ElementTree(cluster)

              # TODO Remove XML namespace  
              ns = {"ns": "http://viaf.org/viaf/terms#"}
              cl_type = cluster.find('{http://viaf.org/viaf/terms#}nameType')
              if cl_type != None:
                    cl_type = cl_type.text
              cl_id = cluster.find('{http://viaf.org/viaf/terms#}viafID')
              if cl_id != None:
                    cl_id = cl_id.text

              names = []
              m_headings = cluster.findall("{http://viaf.org/viaf/terms#}mainHeadings")

              # Traverse the trees for each indivudal element needed
              for element in m_headings:
                  ts = ".//ns:data//ns:text//text()"
                  main = element.xpath(ts, namespaces=ns)
                  for data in main:
                      if len(data) > 0:
                            names.append(data)

              for section in m_headings:
                  datafields = section.findall('subfield')
                  for field in datafields:
                      if len(field) > 0:
                            names.append(field[0].text)


              norm_names = []

              x400s = cluster.findall('{http://viaf.org/viaf/terms#}x400s')
              for x400 in x400s:
                  ts = ".//ns:datafield//ns:normalized//text()"
                  datafield = x400.xpath(ts, namespaces=ns)
                  for name in datafield:
                      if len(name) > 0:
                            norm_names.append(name)

              coauthors = []

              coauth_elems = cluster.findall('{http://viaf.org/viaf/terms#}coauthors')
              for author in coauth_elems:
                  ts = ".//ns:data//ns:text//text()"
                  data = author.xpath(ts, namespaces=ns)
                  for name in data:
                      #ts = ".//ns:text"
                      #name = field.xpath(ts, namespaces=ns)
                      if len(name) > 0:
                            coauthors.append(name)

              publishers = []
              pu_cl = cluster.findall('{http://viaf.org/viaf/terms#}publishers')
              for pub in pu_cl:
                  ts = ".//ns:data//ns:text//text()"
                  data = pub.xpath(ts, namespaces=ns)
                  for name in data:
                      if len(name) > 0:
                            publishers.append(name)

              isbns = []
              isbn_cl = cluster.xpath("//ns:ISBNs", namespaces=ns)
              for isbn in isbn_cl:
                  ts = ".//ns:data//ns:text//text()"
                  data = isbn.xpath(ts, namespaces=ns)
                  for name in data:
                      if len(name) > 0:
                            isbns.append(name)

              countries = []
              cou_cl = cluster.findall('{http://viaf.org/viaf/terms#}countries')
              for country in cou_cl:
                  ts = ".//ns:text//text()"
                  text = country.xpath(ts, namespaces=ns)
                  if len(text) > 0:
                      countries += text

              titles = []

              works = cluster.xpath(".//ns:work//ns:title//text()", namespaces=ns)
              for work in works:
                  if len(work) > 0:
                      titles += [work]

              birth_date = cluster.xpath(".//ns:birthDate", namespaces=ns)
              death_date = cluster.xpath(".//ns:deathDate", namespaces=ns)
              date_type = cluster.xpath(".//ns:dateType", namespaces=ns)

              nationality = cluster.xpath('.//ns:nationalityOfEntity', namespaces=ns)
              if len(nationality) > 0:
                  nationality = nationality[0].xpath('.//ns:data', namespaces=ns)
                  if len(nationality) > 0:
                      nationality = nationality[0].xpath(".//ns:text", namespaces=ns)

                      if len(nationality) > 0:
                          nationality = nationality[0].text

                      else:
                          nationality = ""

              if len(date_type) > 0:
                  date_type = date_type[0].text

              else:
                  date_type = ""

              if len(birth_date) > 0:
                  birth_date = birth_date[0].text

              else:
                  birth_date = ""


              if len(death_date) > 0:
                  death_date = death_date[0].text

              else:
                  death_date = ""

              # Calculate hashes for node types that need them
              coauthor_hashes = []
              for index,coauth in enumerate(coauthors):
                  if coauth == None:
                      del coauthors[index]
                  else:
                      coauthor_hashes.append(CityHash64(coauth))


              publisher_hashes = []
              for index,publisher in enumerate(publishers):
                  if publisher == None:
                      del coauthors[index]
                  else:
                      publisher_hashes.append(CityHash64(publisher))

              title_hashes = []
              for index,value in enumerate(titles):
                  if value == None:
                      del titles[index]
                  else:
                      title_hashes.append(CityHash64(value))

              country_hashes = []
              for index,value in enumerate(countries):
                  if value == None:
                      del countries[index]
                  else:
                      country_hashes.append(CityHash64(value))

              # TODO performance tweaking. Passing a lot of data here, could probably speed this up by reducing amount
              # data = {"pid": cl_id, "type": cl_type, "norm_names": norm_names, "coauthors": coauthors, "publishers": publishers, "isbns": isbns, "countries": countries, "titles": titles, "birth_date": birth_date, "death_date": death_date, "date_type": date_type, "nationality": nationality, "coauthor_hashes": coauthor_hashes, "publisher_hashes": "publisher_hashes": publisher_hashes, "title_hashes": title_hashes}

              rows.append((cl_id, cl_type, names, norm_names, coauthors, publishers, isbns, countries, titles, birth_date, death_date, date_type, nationality, coauthor_hashes, publisher_hashes, title_hashes))

          rows = msgpack.packb(rows, use_bin_type=True)
          push_sock.send(rows)
          # print("Sent data to socket {}".format(socket))
      chunk = msgpack.packb("NONE", use_bin_type=True)
      push_sock.send(chunk)

      



    

# StackOverFlow fucntion for pulling data from an iterable in chunk sizes of n
def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":

    # mp.set_start_method('forkserver')
    # Need an infile, an outfile, and a split file
    # -m is just performance testing
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--infile', '-i', help='Infile (XML) name', required=True)
    parser.add_argument('--outfile', '-o', help='Outfile (TSV) name', required=True)
    parser.add_argument('--split', '-s', help='Split TSV File into Nodes in this directory', required=True)
    parser.add_argument('--mem','-m', action='store_true', help='Load whole file into memory first')
    parser.add_argument("--cpus", "-c", help="CPU Core Count Override")
    args = parser.parse_args()
    infile = args.infile
    outfile = args.outfile


    with open(infile, 'r+b') as read_handle:
        header = ["ID", "Type", "Names", "NormNames", "CoAuth", "Publishers", "ISBN", "Country", "Titles", "StartDate", "EndDate", "DateType", "Nationality"]
        


        step_size = 5
        count = 0

        global q
        global mem

        # Hack to satisfy provisioning scripts
        p1 = subprocess.Popen(["touch","{}.abc".format(outfile)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        p1.wait()
        if p1.returncode != 0:
            _,err = p1.communicate()
            print(err)
            exit(1)

        # Load all data into memory, as opposed to reading it chunk by chunk
        # Bit slower, for some reason
        if args.mem:
            data = read_handle.readlines()
            split_size = mp.cpu_count()
            chunk_size = int(len(data)/split_size)
            total_size = len(data)
            chunks = [data[x - chunk_size:x] for x in range(chunk_size, total_size, chunk_size)]
            q = None
            mem = True
            pool = mp.Pool(os.cpu_count(), initargs=(q, mem))
            data = pool.map(xmlToTsv, chunks)
            for rows in data:
                splitTSVMem(rows, outfile, args.split, header)


        else: 
            # How many records to send to each map function
            # 10 - 100 seems to be the optimal size
            step_size = 5000

            # Iterator that reads from the XML file in chunks of size step_size 
            iterator = grouper(read_handle, step_size)
            
            # Instantiate a multiprocessing queue for each core to feed their results to
            context = zmq.Context()
            ventilator_send = context.socket(zmq.PUB)
            global sockets
            out_sockets = {x:y for x,y in zip(range(0,17), range(5557,5557+17))}
            ventilator_send.bind("tcp://127.0.0.1:5556")
            # q = mp.Queue()
            t = mp.Process(target=splitTSVMem, args=[outfile, args.split, header])
            t.daemon = True
            t.start()

                
            mem = False

            
            # Map all the data to the xmlToTsv function
            if args.cpus:
                cpus = int(args.cpus)
            else:
                cpus = os.cpu_count() -1

            # pool = mp.Pool(cpus, initargs=(mem, sockets))
            processes = []
            contexts = []
            push_socks = []

            for p, out_sock, in_sock in zip(range(cpus), range(5557, 5557+cpus), range(6000, 6000+cpus)):
                curr = mp.Process(target=xmlToTsv, args=[out_sock, in_sock])
                curr.start()
                processes.append(curr)
                curr_con = zmq.Context()
                curr_sock = context.socket(zmq.PUSH)
                curr_sock.bind("tcp://127.0.0.1:{}".format(in_sock))
                contexts.append(curr_con)
                push_socks.append(curr_sock)

            counter = 0
            for chunk, proc in zip(iterator, itertools.cycle(range(cpus))):
                # print("Sending chunk to {}".format(proc))

                chunk = msgpack.packb(chunk, use_bin_type=True)
                push_socks[proc].send(chunk)
                counter += 1

            for proc in range(cpus):
                chunk = msgpack.packb("NONE", use_bin_type=True)
                push_socks[proc].send(chunk)

            for proc in processes:
                proc.join()

            ventilator_send.send_string("NONE")
            t.join()

            # Hack to satisfy provisioning scripts
            p2 = subprocess.Popen(["rm","{}/.abc".format(args.split)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            p3 = subprocess.Popen(["rm","{}.abc".format(outfile)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
