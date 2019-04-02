def removePuncs(old_data):
    cleaned_data = defaultdict(list)
    for key,text in old_data:
        cleaned_data[text.translate(None, string.punctuation)] += key

    return cleaned_data

def cleanData(data):
    try:
        " ".join(data.split())
        data = data.replace("[","")
        data = data.replace("]","")
        punctuations = [',',';','/',':','.', '#','\\']
        if data[len(data)-3:len(data)] == "...":
            data = data[:len(data)-3]
        if data[len(data)-1] in punctuations:
            data = data[:len(data)-1]
        data = data.strip()
        return data
    except:
        return data

