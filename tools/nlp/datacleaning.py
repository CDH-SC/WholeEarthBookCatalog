import string
import re
def removePuncs(old_data):
    cleaned_data = defaultdict(list)
    for key,text in old_data:
        cleaned_data[text.translate(None, string.punctuation)] += key

    return cleaned_data

def cleanData(data):
    if data == None:
        return "None"
    try:
        if type(data) == list:
            old_data = data
            del data
            curr = []
            for data in old_data:
                " ".join(data.split())
                data = data.replace("[","")
                data = data.replace("]","")
                punctuations = string.punctuation
                if data[len(data)-3:len(data)] == "...":
                    data = data[:len(data)-3]
                if data[len(data)-1] in punctuations:
                    data = data[:len(data)-1]
                data = data.strip()
                curr.append(data)
            data = "›".join(curr)

        else:
            " ".join(data.split())
            data = data.replace("[","")
            data = data.replace("]","")
            punctuations = string.punctuation
            if len(data) >= 4:
                if data[len(data)-3:len(data)] == "...":
                    data = data[:len(data)-3]
            if len(data) >= 2:
                if data[len(data)-1] in punctuations:
                    data = data[:len(data)-1]
            data = data.strip()

        return data

    except:
        return data

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
