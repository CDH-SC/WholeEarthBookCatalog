using System;
using System.Collections.Generic;
using System.Text;
using Neo4j;
using Neo4j.Driver;
using Neo4j.Driver.V1;
using System.Linq;

namespace LibraryOfCongressImport.Tools
{
    public static class DBTools
    {
        public static void PushItemToDatabase(ref Item item)
        {
            using (var session = GraphDatabase.Driver(Program.Neo4jUrl).Session())
            {
                // create/locate item based on some identifying feature
                // get id

                var id = session.WriteTransaction(tx =>
                {
                    // transaction here
                    var result = tx.Run("", "");
                    return result.Single()[0].As<string>();
                });
                
                foreach (var attribute in item.Attributes)
                {
                    // create/locate new attributes in db as they appear
                    // get attribute id
                    // cache
                    // create/locate attribute value for item
                    // cache
                    // connect the two in db
                }
            }
        }
    }
}
