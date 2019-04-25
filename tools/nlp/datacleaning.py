import string
import re

def removePuncs(old_data):
    cleaned_data = defaultdict(list)
    for key,text in old_data:
        cleaned_data[text.translate(None, string.punctuation)] += key

    return cleaned_data

def cleanData(data,field_type):
    if data == None:
        return "None"
    try:
        old_data = data
        punctuations = string.punctuation.replace(")","")
        punctuations += "[]"
        if type(data) == list:
            del data
            curr = []
            for data in old_data:
                " ".join(data.split())
                if data[len(data)-3:len(data)] == "...":
                    data = data[:len(data)-3]
                if data[len(data)-1] in punctuations:
                    data = data[:len(data)-1]
                data = data.strip()
                curr.append(data)
            data = "›".join(curr)

        else:
            " ".join(data.split())
            if len(data) >= 4:
                if data[len(data)-3:len(data)] == "...":
                    data = data[:len(data)-3]
            if len(data) >= 2:
                if data[len(data)-1] in punctuations:
                    data = data[:len(data)-1]
            data = data.strip()

        if field_type == "Person":
            data = (data,cleanPuncs(data)) 
        elif field_type == "Date":
            data = cleanDate(data)
        elif field_type == "Place":
            data = (data,cleanPuncs(data)) 
        elif field_type == "Publisher":
            data = (data,cleanPuncs(data)) 
        elif field_type == "ISBN":
            data = (data,cleanPuncs(data)) 

        #if field_type == "Place":
        #    print("BEFORE CLEAN: {} AFTER CLEAN: {}".format(old_data,data))
        return data
    except Exception as e:
        print(e)
        return data

def cleanPuncs(data):
        punctuations = string.punctuation + "[]"
        table = str.maketrans(dict.fromkeys(punctuations))
        data = data.translate(table)
        data = ' '.join(data.split())
        return data.lower()

def cleanDate(date):
    try:
        years = re.findall(r'[0-9]{4}', date)
        if len(years) == 0:
            date = "None"
        else:
            years = "›".join(years)
            date = years 
    except:
        date = "None"

    return date

def extractPlace(data):
    addr = re.search(r'{(.*?)}',data).group(1) 
    data = data.split(",")
