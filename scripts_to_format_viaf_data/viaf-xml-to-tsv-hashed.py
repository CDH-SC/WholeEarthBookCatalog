import argparse
import csv
import DivideTSVs
import mmap
import os
import sys
import time

from cityhash import CityHash64
from lxml import etree
from multiprocessing import Pool, Process, Queue
from itertools import zip_longest

def loadTables(dirname):

    tlist = ["person","aliases","normNames","coAuthor","pub","isbns","countries","titles"]
    theaders = [["id","type", "name", "start", "dateType", "nationality"],
            ["id", "names"],
            ["id", "normName"],
            ["id", "id_2", "coAuth"],
            ["id", "pub_id", "publisher"],
            ["id", "isbnid", "isbn"],
            ["id", "country_id", "country"],
            ["id", "title_id", "title"]]

    return tlist, theaders, { x:csv.writer(open(os.path.join(dirname, "{}Table.tsv".format(x)), 'w'), delimiter='\t') for x in tlist }

def splitTSVMem(queue, outfile, dirname, header):

    with open(outfile, 'w') as write_handle:
        csv_writer = csv.writer(write_handle, delimiter="\t")
        csv_writer.writerow(header)
        if not os.path.exists(dirname):
            os.makedirs(dirname)

        tlist, theaders, tables = loadTables(dirname)

        for tname,theader in zip(tlist, theaders):
            tables[tname].writerow(theader)

        while True:
            rows = queue.get()
            if rows == None:
                break

            used_ids = []
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
                isbn_hashes = row[16]
                country_hashes = row[17]
                name = row[2][0]

                tables["person"].writerow([pid, pType, name, start, end, dType, nat])

                for key,value in zip(coauthor_hashes, coauthors):
                    if key not in used_ids:
                        tables["coAuthor"].writerow([pid, key, value])
                        used_ids.append(key)

                for key, value in zip(publisher_hashes, publishers):
                    if key not in used_ids:
                        tables["pub"].writerow([pid, key, value])
                        used_ids.append(key)

                for key, value in zip(title_hashes, titles):
                    if key not in used_ids:
                        tables["titles"].writerow([pid, key, value])
                        used_ids.append(key)

                for key, value in zip(isbn_hashes, isbns):
                    if key not in used_ids:
                        tables["isbns"].writerow([pid, key, value])
                        used_ids.append(key)

                for key, value in zip(country_hashes, countries):
                    if key not in used_ids:
                        tables["countries"].writerow([pid, key, value])
                        used_ids.append(key)

                for alias in row[2]:
                    tables['aliases'].writerow([pid, alias])

                for normname in row[3]:
                    tables['normNames'].writerow([pid, normname])


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

          isbn_hashes = []
          for index,value in enumerate(isbns):
              if value == None:
                  del isbns[index]
              else:
                  isbn_hashes.append(CityHash64(value))

          country_hashes = []
          for index,value in enumerate(countries):
              if value == None:
                  del countries[index]
              else:
                  country_hashes.append(CityHash64(value))

          rows.append([cl_id, cl_type, names, norm_names, coauthors, publishers, isbns, countries, titles, birth_date, death_date, date_type, nationality, coauthor_hashes, publisher_hashes, title_hashes, isbn_hashes, country_hashes])

      q.put(rows)

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


    with open(infile, 'r+b') as read_handle:
        header = ["ID", "Type", "Names", "NormNames", "CoAuth", "Publishers", "ISBN", "Country", "Titles", "StartDate", "EndDate", "DateType", "Nationality"]


        step_size = 10
        count = 0

        iterator = grouper(read_handle, step_size)
        start_time = time.time()
        global q
        q = Queue()
        t = Process(target=splitTSVMem, args=[q, outfile, args.split, header])
        t.daemon = True
        t.start()

        pool = Pool(os.cpu_count() - 1, initargs=(q))
        for res in pool.imap(xmlToTsv, iterator):
            pass

        q.put(None)
        t.join()


