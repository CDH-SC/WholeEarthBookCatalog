using System;
using System.Collections.Generic;
using System.Text;
using Neo4j;
using Neo4j.Driver;
using Neo4j.Driver.V1;
using System.Linq;
using LibraryOfCongressImport.Lookups;
using System.Threading.Tasks;

namespace LibraryOfCongressImport.Tools
{
    public static class Neo4jDBTools
    {
        private static IDriver _driver = GraphDatabase.Driver(Program.Neo4jUrl);

        private static List<string> _existingItems = new List<string>();
        private static List<string> _existingAttributeTypes = new List<string>();
        private static List<Tuple<string, string>> _existingAttributeTypeValues = new List<Tuple<string, string>>();

        public static void PushItemToDatabase(ref Item item)
        {
            // memory over runs :/
            //var script = BuildScript(ref item);
            //ExecuteScript(script);
            var scripts = BuildScripts(ref item);
            try
            {
                ExecuteScripts(scripts);
            }
            catch(Exception)
            {
                ExecuteScripts(scripts);
            }
        }

        private static List<string> BuildScripts(ref Item item)
        {
            var scripts = new List<string>();
            var itemID = GetItemIdentifier(item);
            if(!_existingItems.Contains(itemID))
            {
                scripts.Add($"CREATE (i:Item{{Name: '{itemID}'}}) RETURN '';");
                _existingItems.Add(itemID);
            }
            else
            {

            }
            foreach(var attribute in item.Attributes)
            {
                if(!_existingAttributeTypes.Contains(attribute.Key))
                {
                    scripts.Add($"CREATE (at:AttributeType{{Type: '{attribute.Key}'}}) RETURN '';");
                    _existingAttributeTypes.Add(attribute.Key);
                }
                else
                {

                }
                if (!_existingAttributeTypeValues.Contains(Tuple.Create(attribute.Key, attribute.Value)))
                {
                    scripts.Add($"CREATE (av:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}) RETURN '';");
                    _existingAttributeTypeValues.Add(Tuple.Create(attribute.Key, attribute.Value));
                }
                else
                {

                }
                scripts.Add($"MATCH (i:Item{{Name: '{itemID}'}}), (av:AttributeValue{{Type:'{attribute.Key}', Value:'{attribute.Value}'}}), (at:AttributeType{{Type: '{attribute.Key}'}}) MERGE (i) -[:has]-> (av) -[:is]-> (at) RETURN '';");
            }
            return scripts;
        }

        private static string BuildScript(ref Item item)
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

        private static string GetItemIdentifier(Item item)
        {
            var controlNumber = item.Attributes.Find((a) => a.Key == AttributeNames.ControlNumber).Value;
            var controlNumberIdentifier = item.Attributes.Find((a) => a.Key == AttributeNames.ControlNumberIdentifier).Value;
            return controlNumberIdentifier + ":" + controlNumber;
        }

        public static string ExecuteScript(string script, int trialNumber = 0, int maxTrialNumber = 3)
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

        public static void ExecuteScripts(List<string> scripts, int trialNumber = 0, int maxTrialNumber = 3)
        {
            using (var session = _driver.Session())
            {
                foreach (var script in scripts)
                {
                    var task = session.WriteTransaction(tx =>
                    {
                        tx.Run(script);
                        return "yay";
                    });
                }
            }
        }
    }
}
