import argparse
import csv
import mmap
import sys
import time

from lxml import etree
from multiprocessing import Pool
from itertools import zip_longest

def xmlToTsv(xml_strings):
      rows = []
      for xml_string in xml_strings:
          cluster = etree.fromstring(xml_string)
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

          rows.append([cl_type, cl_id, names, norm_names, coauthors, publishers, isbns, countries, titles, birth_date, death_date, date_type, nationality])
      return rows
from itertools import zip_longest

def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--infile', '-i', help='Infile (XML) name', required=True)
    parser.add_argument('--outfile', '-o', help='Outfile (TSV) name', required=True)
    pool = Pool()
    args = parser.parse_args()
    infile = args.infile
    outfile = args.outfile
    with open(infile, 'r+b') as read_handle:
        with open(outfile, 'w') as write_handle:
            csv_writer = csv.writer(write_handle, delimiter="\t")
            header = ["ID", "Type", "Names", "NormNames", "CoAuth", "Publishers", "ISBN", "Country", "Titles", "StartDate", "EndDate", "DateType", "Nationality"]
            csv_writer.writerow(header)

            s_time = time.time()

            step_size = 10000
            count = 0

            iterator = grouper(read_handle, step_size)
            for data in pool.imap(xmlToTsv, iterator):
                count += step_size
                print("{} processing time: {}".format(count, time.time()- s_time))
                csv_writer.writerows(data)



