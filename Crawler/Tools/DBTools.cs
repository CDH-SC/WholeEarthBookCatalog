using System;
using System.Collections.Generic;
using System.Text;
using Neo4j;
using Neo4j.Driver;
using Neo4j.Driver.V1;
using System.Linq;
using LibraryOfCongressImport.Lookups;
using System.Threading;

namespace LibraryOfCongressImport.Tools
{
    public static class DBTools
    {
        private static IDriver _driver = GraphDatabase.Driver(Program.Neo4jUrl);

        public static void PushItemToDatabase(ref Item item)
        {
            foreach(var attribute in item.Attributes)
            {
                var itemID = GetItemIdentifier(item);
                var script = 
                    $"MERGE (i:Item{{Name: '{itemID}'}}) " +
                    $"MERGE (at:AttributeType{{Name:'{attribute.Key}'}}) " +
                    $"MERGE (av:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}) " +
                    $"MERGE (i) -[:has]-> (av) -[:is]-> (at) " +
                    $"RETURN 'SUCCESS';";
                ExecuteScript(script);
            }
        }

        private static string GetItemIdentifier(Item item)
        {
            var controlNumber = item.Attributes.Find((a) => a.Key == AttributeNames.ControlNumber).Value;
            var controlNumberIdentifier = item.Attributes.Find((a) => a.Key == AttributeNames.ControlNumberIdentifier).Value;
            return controlNumberIdentifier + ":" + controlNumber;
        }

        private static string ExecuteScript(string script)
        {
            try
            {
                using (var session = _driver.Session(AccessMode.Write))
                {
                    var value = session.WriteTransaction(tx =>
                    {
                        // transaction here
                        var result = tx.Run(script);
                        return result.Single()[0].As<string>();
                    });
                    return value;
                }
            }
            catch (InvalidOperationException)
            {
                // This occurs when response splits, bad, but I can focus on fixing later
                return "SUCCESS?";
            }
            catch (Exception)
            {
                return "FAIL";
            }
        }
    }
}
