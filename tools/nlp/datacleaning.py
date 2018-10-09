def cleanData(data):
    try:
        " ".join(data.split())
        data = data.replace("[","")
        data = data.replace("]","")
        punctuations = [',',';','/',':','.']
        if data[len(data)-3:len(data)] == "...":
            data = data[:len(data)-3]
        if data[len(data)-1] in punctuations:
            data = data[:len(data)-1]
        data = data.strip()
        return data
    except:
        return data

