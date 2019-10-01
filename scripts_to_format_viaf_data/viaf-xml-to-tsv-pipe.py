import argparse
import csv
import DivideTSVs
import mmap
import os
import sys
import time

from lxml import etree
from multiprocessing import Pool, Process, Pipe
from itertools import zip_longest
from DivideTSVs import loadTables

def splitTSVMem(child):
    dirname = child.recv()

    if not os.path.exists(dirname):
        os.makedirs(dirname)

    tlist, theaders, tables = loadTables(dirname)

    for tname,theader in zip(tlist, theaders):
        tables[tname].writerow(theader)

    # Skip header

    id_vals = { prop:id_val for prop,id_val in zip(tlist[3:], range(0, (len(tlist)*10000000), 10000000)) }
    global_dict = {}

    while True:
        rows = child.recv()
        if rows == None:
            break

        csv_writer.writerows(rows)
        for row in rows:
            pid, pType = row[0:2]
            start, end, dType, nat = row[9:13]
            row_vals = { tname:node for tname,node in zip(tlist[1:], row[2:9]) }
            row_vals[tlist[0]] = row_vals['aliases'][0]

            for key, value in row_vals.items():

                if key == "person":
                    tables[key].writerow([pid, pType, value, start, end, dType, nat])

                elif key in ["coAuthor","pub","titles","isbns","countries"]:
                    for sub_val in value:

                        # Really hacky and inefficient, I know
                        type_string = "{}:{}".format(key, str(sub_val))

                        if type_string in global_dict:
                            tables[key].writerow([pid, global_dict[type_string], sub_val])

                        else:
                            tables[key].writerow([pid, id_vals[key], sub_val])
                            global_dict[type_string] = id_vals[key]
                            id_vals[key] += 1

                else:
                    for sub_val in value:
                        tables[key].writerow([pid, sub_val])

def xmlToTsv(xml_strings):
      rows = []
      for xml_string in xml_strings:
          try:
            cluster = etree.fromstring(xml_string)
          except:
            continue
          cluster = etree.ElementTree(cluster)

          ns = {"ns": "http://viaf.org/viaf/terms#"}
          cl_type = cluster.find('{http://viaf.org/viaf/terms#}nameType')
          if cl_type != None:
                cl_type = cl_type.text
          cl_id = cluster.find('{http://viaf.org/viaf/terms#}viafID')
          if cl_id != None:
                cl_id = cl_id.text

          names = []
          m_headings = cluster.findall("{http://viaf.org/viaf/terms#}mainHeadings")

          for element in m_headings:
              ts = ".//ns:data"
              main = element.xpath(ts, namespaces=ns)
              for data in main:
                  ts = ".//ns:text"
                  text = data.xpath(ts, namespaces=ns)
                  if len(text) > 0:
                        names.append(text[0].text)

          for section in m_headings:
              datafields = section.findall('subfield')
              for field in datafields:
                  if len(field) > 0:
                        names.append(field[0].text)


          norm_names = []

          x400s = cluster.findall('{http://viaf.org/viaf/terms#}x400s')
          for x400 in x400s:
              ts = ".//ns:datafield"
              datafield = x400.xpath(ts, namespaces=ns)
              for field in datafield:
                  ts = ".//ns:normalized"
                  name = field.xpath(ts, namespaces=ns)
                  if len(name) > 0:
                        norm_names.append(name[0].text)

          coauthors = []

          coauth_elems = cluster.findall('{http://viaf.org/viaf/terms#}coauthors')
          for author in coauth_elems:
              ts = ".//ns:data"
              data = author.xpath(ts, namespaces=ns)
              for field in data:
                  ts = ".//ns:text"
                  name = field.xpath(ts, namespaces=ns)
                  if len(name) > 0:
                        coauthors.append(name[0].text)

          publishers = []
          pu_cl = cluster.findall('{http://viaf.org/viaf/terms#}publishers')
          for pub in pu_cl:
              ts = ".//ns:data"
              data = pub.xpath(ts, namespaces=ns)
              for field in data:
                  ts = ".//ns:text"
                  name = field.xpath(ts, namespaces=ns)
                  if len(name) > 0:
                        publishers.append(name[0].text)

          isbns = []
          isbn_cl = cluster.xpath("//ns:ISBNs", namespaces=ns)
          for isbn in isbn_cl:
              ts = ".//ns:data"
              data = isbn.xpath(ts, namespaces=ns)
              for field in data:
                  ts = ".//ns:text"
                  name = field.xpath(ts, namespaces=ns)
                  if len(name) > 0:
                        isbns.append(name[0].text)

          countries = []
          cou_cl = cluster.findall('{http://viaf.org/viaf/terms#}countries')
          for country in cou_cl:
              ts = ".//ns:text"
              text = country.xpath(ts, namespaces=ns)
              if len(text) > 0:
                  countries.append(text[0].text)

          titles = []

          works = cluster.xpath(".//ns:work", namespaces=ns)
          for work in works:
              ts = ".//ns:title"
              title = work.xpath(ts, namespaces=ns)
              if len(title) > 0:
                  titles.append(title[0].text)

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

          rows.append([cl_id, cl_type, names, norm_names, coauthors, publishers, isbns, countries, titles, birth_date, death_date, date_type, nationality])
      return rows

def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--infile', '-i', help='Infile (XML) name', required=True)
    parser.add_argument('--outfile', '-o', help='Outfile (TSV) name', required=True)
    parser.add_argument('--split', '-s', help='Split TSV File into Nodes in this directory', required=True) 
    args = parser.parse_args() 
    infile = args.infile 
    outfile = args.outfile

    pool = Pool(os.cpu_count() - 1) 

    with open(infile, 'r+b') as read_handle:
        header = ["ID", "Type", "Names", "NormNames", "CoAuth", "Publishers", "ISBN", "Country", "Titles", "StartDate", "EndDate", "DateType", "Nationality"]


        with open(outfile, 'w') as write_handle:
            csv_writer = csv.writer(write_handle, delimiter="\t")
            csv_writer.writerow(header)
            step_size = 1000
            count = 0

            iterator = grouper(read_handle, step_size)
            start_time = time.time()
            parent, child = Pipe(duplex=False)
            t = Process(target=splitTSVMem, args=((child),))
            parent.send(args.split)
            t.daemon = True
            t.start()

            for data in pool.imap(xmlToTsv, iterator):
                count += step_size
                csv_writer.writerows(data)
                parent.send(data)

            parent.send(None)
            t.join()

        #if args.split:
        #      split_dir = args.split
        #      splitTSV(outfile, split_dir)

