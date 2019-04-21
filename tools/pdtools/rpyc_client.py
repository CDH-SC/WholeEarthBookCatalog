import rpyc
from utils import *

try:

   conn = rpyc.connect('localhost',8999) 
   searchName = lambda name,field,threshold: conn.root.searchName(name,field,threshold)
   query_df = lambda query: conn.root.query(query)

except:
    print ("Unable to connect to rpyc server. Is it running?")
    
