import ast
import csv
import os

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

def splitTSV(tsvname, dirname):
    f_handle = open(tsvname)
    csv_reader = csv.reader(f_handle, delimiter='\t')

    if not os.path.exists(dirname):
        os.makedirs(dirname)

    tlist, theaders, tables = loadTables(dirname)

    for tname,theader in zip(tlist, theaders):
        tables[tname].writerow(theader)

    # Skip header
    next(csv_reader)

    id_vals = { prop:id_val for prop,id_val in zip(tlist[3:], range(0, (len(tlist)*10000000), 10000000)) }
    global_dict = {}

    for row in csv_reader:
        pid, pType = row[0:2]
        start, end, dType, nat = row[9:13]
        row_vals = { tname:ast.literal_eval(node) for tname,node in zip(tlist[1:], row[2:9]) }
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

