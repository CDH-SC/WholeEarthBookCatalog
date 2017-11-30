using LibraryOfCongressImport.Lookups;
using LibraryOfCongressImport.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace LibraryOfCongressImport.Parsers
{
    class LeaderFieldParser
    {        
        public static void ParseLeaderField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            LogTools.Log("ParseLeaderField", element.Value);
            var raw = element.Value.ToCharArray();
            if (raw.Length == 24)
            {
                ParseRecordStatus(ref attributes, ref raw);
                ParseSpecificRecordType(ref attributes, ref raw);
                ParseGenericRecordType(ref attributes, ref raw);
                ParseBibliographicLevel(ref attributes, ref raw);
                ParseControlType(ref attributes, ref raw);
                ParseMultipartRecordLevel(ref attributes, ref raw);
            }
        }

        private static void ParseRecordStatus(ref List<ItemAttribute> attributes, ref char[] raw) 
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.RecordStatus,
                index: 5,
                map: ref LeaderAndControlFieldAttributeMaps.RecordStatusTypeMap);

        private static void ParseSpecificRecordType(ref List<ItemAttribute> attributes, ref char[] raw) 
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.SpecificRecordType,
                index: 6,
                map: ref LeaderAndControlFieldAttributeMaps.SpecificRecordTypeMap);

        private static void ParseGenericRecordType(ref List<ItemAttribute> attributes, ref char[] raw) 
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.GenericRecordType,
                index: 6,
                map: ref LeaderAndControlFieldAttributeMaps.GenericRecordTypeMap);

        private static void ParseBibliographicLevel(ref List<ItemAttribute> attributes, ref char[] raw) 
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.BibliographicLevel,
                index: 7,
                map: ref LeaderAndControlFieldAttributeMaps.BibliographicLevelMap);

        private static void ParseControlType(ref List<ItemAttribute> attributes, ref char[] raw) 
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.ControlType,
                index: 8,
                map: ref LeaderAndControlFieldAttributeMaps.ControlTypeMap);

        private static void ParseMultipartRecordLevel(ref List<ItemAttribute> attributes, ref char[] raw) 
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.MultipartResourceRecordLevel,
                index: 19,
                map: ref LeaderAndControlFieldAttributeMaps.MultipartResourceRecordLevelMap);
    }
}
