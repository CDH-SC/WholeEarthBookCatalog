using LibraryOfCongressImport.Lookups;
using LibraryOfCongressImport.Tools;
using LibraryOfCongressImport.Parsers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;

namespace LibraryOfCongressImport
{
    public class ItemAttribute
    {
        public string Key = "";
        public string Value = "";

        public static void ParseAttributes(XElement element, ref List<ItemAttribute> attributes)
        {
            // Route Attribute to the Proper Parser
            switch (element.Name.LocalName)
            {
                case AttributeTypeStrings.LeaderKey:
                    LeaderFieldParser.ParseLeaderField(ref element, ref attributes);
                    break;
                case AttributeTypeStrings.ControlFieldKey:
                    ControlFieldParser.ParseControlField(ref element, ref attributes);
                    break;
                case AttributeTypeStrings.DataFieldKey:
                    DataFieldParser.ParseDataField(ref element, ref attributes);
                    break;
                default:
                    break;
            }
        }
        
        #region Shared Functions
        public static void AddAttribute(ref ItemAttribute attribute, ref List<ItemAttribute> attributes)
        {
            if (!String.IsNullOrWhiteSpace(attribute.Value))
            {
                SanitizeItemAttribute(ref attribute);
                attributes.Add(attribute);
                LogTools.LogNewAttribute("AddAttribute", attribute);
            }
        }

        private static void SanitizeItemAttribute(ref ItemAttribute attribute)
        {
            attribute.Key = attribute.Key.Replace("'", "\\'");
            attribute.Value = attribute.Value.Replace("'", "\\'");
        }

        public static void ParseDirect(ref XElement element, ref List<ItemAttribute> attributes, string attributeKey)
        {
            var attribute = new ItemAttribute()
            {
                Key = attributeKey,
                Value = element.Value.Trim()
            };
            AddAttribute(ref attribute, ref attributes);
        }

        public static void ParseDirectDateTime(ref XElement element, ref List<ItemAttribute> attributes, string attributeKey, string format)
        {
            var attribute = new ItemAttribute()
            {
                Key = attributeKey
            };
            DateTime parsedDateTime;
            if (DateTime.TryParseExact(element.Value.ToString(), format, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out parsedDateTime))
            {
                attribute.Value = parsedDateTime.ToString();
                AddAttribute(ref attribute, ref attributes);
            }
        }

        public static void ParseDirectWithMap(ref XElement element, ref List<ItemAttribute> attributes, string attributeKey, Dictionary<string, string> map)
        {
            var attribute = new ItemAttribute()
            {
                Key = attributeKey,
                Value = element.Value.Trim()
            };
            if (map.ContainsKey(attribute.Value))
            {
                attribute.Value = map[attribute.Value];
                AddAttribute(ref attribute, ref attributes);
            }
            else if (map.ContainsKey(" "))
            {
                attribute.Value = map[" "];
                AddAttribute(ref attribute, ref attributes);
            }
        }

        public static void ParseDirectWithSubFields(ref XElement element, ref List<ItemAttribute> attributes, ref Dictionary<string, string> map)
        {
            foreach (var subfield in element.Elements())
            {
                var code = subfield.Attribute("code").Value;
                if(map.ContainsKey(code))
                {
                    var attribute = new ItemAttribute()
                    {
                        Key = map[code],
                        Value = subfield.Value.Trim()
                    };
                    AddAttribute(ref attribute, ref attributes);
                }
            }
        }

        public static void ParseFixedLength(ref char[] raw, ref List<ItemAttribute> attributes, string attributeKey, int start, int end)
        {
            var attribute = new ItemAttribute()
            {
                Key = attributeKey
            };
            attribute.Value = new string(raw.Skip(start).Take(end - start + 1).ToArray()).Trim();
            AddAttribute(ref attribute, ref attributes);
        }

        public static void ParseFixedLengthDateTime(ref char[] raw, ref List<ItemAttribute> attributes, string attributeKey, int start, int end, string format)
        {
            var attribute = new ItemAttribute()
            {
                Key = attributeKey
            };
            DateTime parsedDateTime;
            attribute.Value = new string(raw.Skip(start).Take(end - start + 1).ToArray()).Trim();
            if (DateTime.TryParseExact(attribute.Value, format, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out parsedDateTime))
            {
                attribute.Value = parsedDateTime.ToString();
                AddAttribute(ref attribute, ref attributes);
            }
        }

        public static void ParseFixedLengthWithMap(ref char[] raw, ref List<ItemAttribute> attributes, string attributeKey, int index, ref Dictionary<char, string> map)
        {
            var attribute = new ItemAttribute()
            {
                Key = attributeKey
            };
            if (map.ContainsKey(raw[index]))
            {
                attribute.Value = map[raw[index]];
                AddAttribute(ref attribute, ref attributes);
            }
            else if (map.ContainsKey(' '))
            {
                attribute.Value = map[' '];
                AddAttribute(ref attribute, ref attributes);
            }
        }

        public static void ParseMultipleFixedLengthWithMap(ref char[] raw, ref List<ItemAttribute> attributes, string attributeKey, int start, int end, ref Dictionary<char, string> map)
        {
            for(var index = start; index <= end; index++)
            {
                var attribute = new ItemAttribute()
                {
                    Key = attributeKey
                };
                if (map.ContainsKey(raw[index]))
                {
                    attribute.Value = map[raw[index]];
                    AddAttribute(ref attribute, ref attributes);
                }
                else if (map.ContainsKey(' '))
                {
                    attribute.Value = map[' '];
                    AddAttribute(ref attribute, ref attributes);
                } 
            }
        }
        #endregion
    }
}
