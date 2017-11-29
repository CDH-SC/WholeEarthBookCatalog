using LibraryOfCongressImport.Lookups;
using LibraryOfCongressImport.Tools;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace LibraryOfCongressImport.Parsers
{
    class ControlFieldParser
    {
        public static void ParseControlField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            var tag = element.Attribute("tag").Value;
            switch (tag)
            {
                // Control Number
                case TagNumbers.ControlNumberTag:
                    ParseControlNumber(ref element, ref attributes);
                    break;
                // Control Number Identifier
                case TagNumbers.ControlNumberIdentifierTag:
                    ParseControlNumberIdentifier(ref element, ref attributes);
                    break;
                // Date and Time of Latest Transaction
                case TagNumbers.DateAndTimOfLatestTransactionTag:
                    ParseDateAndTimeOfLatestTransaction(ref element, ref attributes);
                    break;
                // Fixed-Length Data Elements - Additional Material Characteristics
                case TagNumbers.FixedLengthDataElementsOfAdditionalMaterialCharacteristicTag:
                    ParseFixedLengthDataElementsOfAdditionalMaterialCharacteristic(ref element, ref attributes);
                    break;
                // Physical Description Fixed Field
                case TagNumbers.PhysicalDescriptionFixedFieldTag:
                    ParsePhysicalDescription(ref element, ref attributes);
                    break;
                // Fixed-Length Data Elements
                case TagNumbers.FixedLengthDataElementTag:
                    ParseFixedLengthDataElement(ref element, ref attributes);
                    break;
                default:
                    LogTools.LogUnknownTag("ParseControlField", tag);
                    break;
            }
        }

        private static void ParseControlNumber(ref XElement element, ref List<ItemAttribute> attributes)
            => ItemAttribute.ParseDirect(
                element: ref element,
                attributes: ref attributes,
                attributeKey: AttributeNames.ControlNumber);

        private static void ParseControlNumberIdentifier(ref XElement element, ref List<ItemAttribute> attributes)
            => ItemAttribute.ParseDirect(
                element: ref element,
                attributes: ref attributes,
                attributeKey: AttributeNames.ControlNumberIdentifier);

        private static void ParseDateAndTimeOfLatestTransaction(ref XElement element, ref List<ItemAttribute> attributes)
            => ItemAttribute.ParseDirectDateTime(
                element: ref element,
                attributes: ref attributes,
                attributeKey: AttributeNames.DateTimeOfLastTransaction,
                format: "yyyyMMddHHmmss\\.F");

        private static void ParseFixedLengthDataElementsOfAdditionalMaterialCharacteristic(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: write parsing logic

            var type = attributes.Find((attribute) => attribute.Key == AttributeNames.GenericRecordType);
            switch (type.Value)
            {
                default:
                    break;
            }
        }

        private static void ParsePhysicalDescription(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: write parsing logic
        }

        #region Parsing Logic for Fixed-Length Data Elements
        private static void ParseFixedLengthDataElement(ref XElement element, ref List<ItemAttribute> attributes)
        {
            var raw = element.Value.ToCharArray();

            // Parse Generic Fields
            ParseDateEnteredOnFile(ref attributes, ref raw);
            ParseFlexibleDates(ref attributes, ref raw);
            ParsePlaceOfPublication(ref attributes, ref raw);
            ParseLanguage(ref attributes, ref raw);
            ParseModifiedRecord(ref attributes, ref raw);
            ParseCatalgoingSource(ref attributes, ref raw);

            // Parse RecordType Specific fields
            var type = attributes.Find((attribute) => attribute.Key == AttributeNames.GenericRecordType).Value;
            switch (type)
            {
                case LeaderAndControlFieldAttributeMaps.GenericRecordTypes.Book:
                    ParseFixedLengthDataElementOfBook(ref element, ref attributes, ref raw);
                    break;
                case LeaderAndControlFieldAttributeMaps.GenericRecordTypes.ComputerFile:
                    ParseFixedLengthDataElementOfComputerFile(ref element, ref attributes, ref raw);
                    break;
                case LeaderAndControlFieldAttributeMaps.GenericRecordTypes.ContinuingResource:
                    ParseFixedLengthDataElementOfContinuingResource(ref element, ref attributes, ref raw);
                    break;
                case LeaderAndControlFieldAttributeMaps.GenericRecordTypes.VisualMaterials:
                    ParseFixedLengthDataElementOfVisualMaterial(ref element, ref attributes, ref raw);
                    break;
                case LeaderAndControlFieldAttributeMaps.GenericRecordTypes.Map:
                    ParseFixedLengthDataElementOfMap(ref element, ref attributes, ref raw);
                    break;
                case LeaderAndControlFieldAttributeMaps.GenericRecordTypes.MixedMaterials:
                    ParseFixedLengthDataElementOfMixedMaterial(ref element, ref attributes, ref raw);
                    break;
                default:
                    break;
            }
        }

        private static void ParseDateEnteredOnFile(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthDateTime(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.DateEnteredOnFile,
                start: 0,
                end: 5,
                format: "yyMMdd");

        private static void ParseFlexibleDates(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.TypeOfDateOrPublicationStatus,
                index: 6,
                map: ref LeaderAndControlFieldAttributeMaps.TypeOfDateOrPublicationStatusMap);

        private static void ParsePlaceOfPublication(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLength(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.PlaceOfPublicationProductionOrExecution,
                start: 15,
                end: 17);

        private static void ParseLanguage(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLength(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.Language,
                start: 35,
                end: 37);

        private static void ParseModifiedRecord(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.ModifiedRecord,
                index: 38,
                map: ref LeaderAndControlFieldAttributeMaps.ModifiedRecordTypeMap);

        private static void ParseCatalgoingSource(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.CatalogingSource,
                index: 39,
                map: ref LeaderAndControlFieldAttributeMaps.CatalogingSourceMap);

        #region Book Specific Parsing Logic
        private static void ParseFixedLengthDataElementOfBook(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            ParseIllustrationsOfBook(ref attributes, ref raw);
            ParseTargetAudienceOfBook(ref attributes, ref raw);
            ParseFormOfBook(ref attributes, ref raw);
            ParseNatureOfContentsOfBook(ref attributes, ref raw);
            ParseGovernmentPublicationOfBook(ref attributes, ref raw);
            ParseConferencePublicationOfBook(ref attributes, ref raw);
            ParseFestschriftOfBook(ref attributes, ref raw);
            ParseIndexOfBook(ref attributes, ref raw);
            ParseLiteraryFormOfBook(ref attributes, ref raw);
            ParseBiographyOfBook(ref attributes, ref raw);
        }

        private static void ParseIllustrationsOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseMultipleFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.Illustrations,
                start: 18,
                end: 21,
                map: ref LeaderAndControlFieldAttributeMaps.IllustrationsMap);

        private static void ParseTargetAudienceOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.TargetAudience,
                index: 22,
                map: ref LeaderAndControlFieldAttributeMaps.TargetAudienceMap);

        private static void ParseFormOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.FormOfItem,
                index: 23,
                map: ref LeaderAndControlFieldAttributeMaps.FormOfBookMap);

        private static void ParseNatureOfContentsOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseMultipleFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.NatureOfContents,
                start: 24,
                end: 27,
                map: ref LeaderAndControlFieldAttributeMaps.NatureOfContentsOfBookMap);

        private static void ParseGovernmentPublicationOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.GovernmentPublication,
                index: 28,
                map: ref LeaderAndControlFieldAttributeMaps.GovernmentPublicationOfBookMap);

        private static void ParseConferencePublicationOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.ConferencePublication,
                index: 29,
                map: ref LeaderAndControlFieldAttributeMaps.ConferencePublicationOfBookMap);

        private static void ParseFestschriftOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.Festschrift,
                index: 30,
                map: ref LeaderAndControlFieldAttributeMaps.FestschriftOfBookMap);

        private static void ParseIndexOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.Index,
                index: 31,
                map: ref LeaderAndControlFieldAttributeMaps.IndexOfBookMap);

        private static void ParseLiteraryFormOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
            => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.LiteraryForm,
                index: 33,
                map: ref LeaderAndControlFieldAttributeMaps.LiteraryFormOfBookMap);

        private static void ParseBiographyOfBook(ref List<ItemAttribute> attributes, ref char[] raw)
           => ItemAttribute.ParseFixedLengthWithMap(
                raw: ref raw,
                attributes: ref attributes,
                attributeKey: AttributeNames.Biography,
                index: 34,
                map: ref LeaderAndControlFieldAttributeMaps.BiographyOfBookMap);

        #endregion

        private static void ParseFixedLengthDataElementOfComputerFile(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            //todo: write fl parsing logic
        }

        private static void ParseFixedLengthDataElementOfMap(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            //todo: write fl parsing logic
        }

        private static void ParseFixedLengthDataElementOfMusic(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            //todo: write fl parsing logic
        }

        private static void ParseFixedLengthDataElementOfContinuingResource(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            //todo: write fl parsing logic
        }

        private static void ParseFixedLengthDataElementOfVisualMaterial(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            //todo: write fl parsing logic
        }

        private static void ParseFixedLengthDataElementOfMixedMaterial(ref XElement element, ref List<ItemAttribute> attributes, ref char[] raw)
        {
            //todo: write fl parsing logic
        } 
        #endregion
    }
}
