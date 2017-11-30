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
            var script = BuildScript(ref item);
            ExecuteScript(script);
        }

        public static string BuildGracefulScript(ref Item item)
        {
            var script = new StringBuilder();
            var itemID = GetItemIdentifier(item);
            var count = 0;
            var attributeValueDict = new Dictionary<string, string>();
            script.Append($"MERGE (i:Item{{Name: '{itemID}'}}) ");
            foreach(var attribute in item.Attributes)
            {
                if(attributeValueDict.ContainsKey(attribute.Key))
                {
                    var at = attributeValueDict[attribute.Key];
                    script.Append($"MERGE (av{count}:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}) ");
                    script.Append($"MERGE (i) -[:has]-> (av{count}) -[:is]-> ({at}) ");
                }
                else
                {
                    attributeValueDict.Add(attribute.Key, $"at{count}");
                    script.Append($"MERGE (at{count}:AttributeType{{Name:'{attribute.Key}'}}) ");
                    script.Append($"MERGE (av{count}:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}) ");
                    script.Append($"MERGE (i) -[:has]-> (av{count}) -[:is]-> (at{count}) ");
                }
                count++;
            }
            script.Append($"RETURN 'SUCCESS';");
            return script.ToString();
        }

        public static string BuildScript(ref Item item)
        {
            var script = new StringBuilder();
            var itemID = GetItemIdentifier(item);
            var count = 0;
            var attributeValueDict = new Dictionary<string, string>();
            script.Append($"CREATE (i:Item{{Name: '{itemID}'}}) ");
            foreach (var attribute in item.Attributes)
            {
                if (attributeValueDict.ContainsKey(attribute.Key))
                {
                    var at = attributeValueDict[attribute.Key];
                    script.Append($"CREATE (av{count}:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}) ");
                    script.Append($"CREATE (i) -[:has]-> (av{count}) -[:is]-> ({at}) ");
                }
                else
                {
                    attributeValueDict.Add(attribute.Key, $"at{count}");
                    script.Append($"MERGE (at{count}:AttributeType{{Name:'{attribute.Key}'}}) ");
                    script.Append($"CREATE (av{count}:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}) ");
                    script.Append($"CREATE (i) -[:has]-> (av{count}) -[:is]-> (at{count}) ");
                }
                count++;
            }
            script.Append($"RETURN 'SUCCESS';");
            return script.ToString();
        }

        private static string GetItemIdentifier(Item item)
        {
            var controlNumber = item.Attributes.Find((a) => a.Key == AttributeNames.ControlNumber).Value;
            var controlNumberIdentifier = item.Attributes.Find((a) => a.Key == AttributeNames.ControlNumberIdentifier).Value;
            return controlNumberIdentifier + ":" + controlNumber;
        }

        private static string ExecuteScript(string script, int trialNumber = 0, int maxTrialNumber = 3)
        {
            using (var session = _driver.Session())
            {
                var value = session.WriteTransaction(tx =>
                {
                    // transaction here
                    try
                    {
                        var result = tx.Run(script);
                        return result.First()[0].As<string>();
                    }
                    catch (Exception)
                    {
                        if (trialNumber <= maxTrialNumber)
                            return ExecuteScript(script, trialNumber + 1, maxTrialNumber);
                        else
                            throw;
                    }
                });
                return value;
            }
        }
    }
}
