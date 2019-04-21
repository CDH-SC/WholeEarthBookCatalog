from load_all import *
from searcher import *
print ("Finished loading dframe")
import rpyc


place_data,place_id_mapping = loadBatch('Place')
print ("Place data loaded")
person_data,person_id_mapping = loadBatch('Person')
print ("Person data loaded")
publisher_data,publisher_id_mapping = loadBatch('Publisher')
print ("Publisher data loaded")
#edition_data,edition_id_mapping = loadBatch('Edition')
#print ("Edition data loaded")


class df_op(rpyc.Service):
    def on_connect(self, conn):
        # code that runs when a connection is created
        # (to init the service, if needed)
        pass

    def on_disconnect(self, conn):
        # code that runs after the connection has already closed
        # (to finalize the service, if needed)
        pass

    def searchPerson(self, name, threshold):
        return [x[1] for x in cosSearch(data=person_data,id_mapping=person_id_mapping,search_phrase=name,threshold=threshold)]

    def searchPublisher(self, name, threshold):
        return [x[1] for x in cosSearch(data=publisher_data,id_mapping=publisher_id_mapping,search_phrase=name,threshold=threshold)]

    def searchEdition(self, name, threshold):
        return [x[1] for x in cosSearch(data=edition_data,id_mapping=edition_id_mapping,search_phrase=name,threshold=threshold)]

    def searchPlace(self, name, threshold):
        return [x[1] for x in cosSearch(data=place_data,id_mapping=place_id_mapping,search_phrase=name,threshold=threshold)]

    def exposed_query(self, query):
        return big_df.query(query)

    def exposed_searchName(self, name, field, threshold):
        if field == "Publisher":
            ids = self.searchPublisher(name, threshold)
            return big_df[big_df['Publisher_ID'].isin(ids)] 

        elif field == "Place":
            ids = self.searchPlace(name, threshold)
            return big_df[big_df['Place_ID'].isin(ids)] 

        elif field == "Edition":
            ids = self.searchEdition(name, threshold)
            return big_df[big_df['Edition_ID'].isin(ids)] 

        elif field == "Person":
            ids = self.searchPerson(name, threshold)
            return big_df[big_df['Person_ID'].isin(ids)] 

        else:
            return "Bad Request"


if __name__ == "__main__":
    from rpyc.utils.server import ThreadedServer

    t = ThreadedServer(df_op, protocol_config = {"allow_all_attrs" : True},  port=8999)
    t.start()
