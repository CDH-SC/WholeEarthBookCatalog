""" Metadata
Recreated on Sunday, October 16, 2016
@author: Colin Wilder
Other intellectual property allegations: Incorporates some code from the Programming Historian. DHC 2.0 was designed by CFW and Travis Mullen and implemented by Travis Mullen. The present version is not implemented or designed by Travis at all, but doubtless has some conceptual/design elements that carry over from DHC 2.0. So some credit to Travis probably percolates in there.
Notes: This is a partial reboot of the main crawler.
The change is as follows: This version makes the URLs in a different way. Instead of making one for each search string up front, I put the search string(s) into a list, and loop through the list. In the loop, I use my utility function makeURLforNextPageOfResults each time. Seems to work.

TODO:
 - put retrieved book records into instances of your edition class
 - put retrieved author names into instances of your person class
 - record links between them as pairs or something (or in Neo4J)
 - compare author names via edit distance, after stripNonAlphaNumeric, lowerCasing, etc.
 - write the log to an html file and open it up in a new browser tab so you can see it immediately (for dev. purposes)

NOTES:
 - Doesn't make sense to sort items because first letters could be aberrations. Searching i.e. edit distance measuring will depend on all letters taken together.
 - Actually sorting first might help. I remember we did that late in 350. Also, pre-sorting is mentioned several times in http://cs.stackexchange.com/questions/27539/how-fast-can-we-identifiy-almost-duplicates-in-a-list-of-strings.
 - So pre-sort the list of terms.
    + Check item 0 against all the ones after it in sorted list of n terms.
    + Then check item 1 against all the terms after it.
    + Then check item 2 against all the terms after it.
    + Then check item i against all the terms after it, up to the n-1th and final item.
"""

import os, datetime, string, urllib2, utilities, webbrowser, sys, json, time

# we should just take file input
def get_query_strings(fname):
    with open(fname, "r") as f:
        query_strings = [line for line in f]
    return query_strings

def get_OCLC_numbers(q_string):
    OCLCNumbers = [] #receptacle to put OCLC numbers in
    pageNumberToTry = 1 # for iterating results pages

    for searchString in q_strings:
        while len(OCLCNumbers) < 25:
            # make URL, visit page, capture its HTML
            nextPageOfResultsURL=utilities.makeURLforNextPageOfResults(searchString, pageNumberToTry)
            response = urllib2.urlopen(nextPageOfResultsURL)
            retrieved_HTML = response.read() # here is the first stage - the original capture

            # if no error, capture OCLC numbers and iterate
            errorMessage = "Search Error" # this is the only marker in the HTML search results pages I could find that works
            print "\ntesting whether resulting page is error or has results"
            if string.find(retrieved_HTML, errorMessage) > -1: # error message is a substring of page
                # error # page does not work
                raise(Exception("Encountered an error parsing the html"))
            else: # look at the successful page and extract OCLC numbers
                print "extracting OCLC numbers from page"
                utilities.getOCLCNumbers(OCLCNumbers, retrieved_HTML)
                print "after page(s) of results from this search string, OCLCNumbers list is {}\n".format(OCLCNumbers)
                pageNumberToTry += 1 # increment page number
                utilities.waitRandomTime()
    return OCLCNumbers

def get_OCLC_ls_data(oclc_list):
    d = {}
    for oclc_num in oclc_list:
        d[oclc_num] = utilities.OCLCNumberToRecord(oclc_num)
        utilities.waitRandomTime()
    return d

if __name__ == '__main__':

    #commencement
    print "DHC 2.1"

    t = "".join(str(time.time()).split("."))
    folderPath = "./output"
    outpath = "{}/{}.json".format(folderPath,t)

    # make path if necessary
    if not os.path.exists(folderPath):
        os.makedirs(folderPath)

    # output to console and to log file confirming receipt of inpu#
    # will make input checking more robust later...
    fname = sys.argv[1]
    q_strings = get_query_strings(fname)
    oclc_numbers = get_OCLC_numbers(q_strings)
    data = json.dumps(get_OCLC_ls_data(oclc_numbers), indent=4, encoding="iso-8859-1")

    with open(outpath, "w") as f:
        f.write(data)

    # the end
    print "finished"
