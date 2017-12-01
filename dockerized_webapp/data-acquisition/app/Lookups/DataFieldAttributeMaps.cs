using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryOfCongressImport.Lookups
{
    public static class DataFieldAttributeMaps
    {
        public static Dictionary<string, string> LibraryOfCongressControlNumberMap = new Dictionary<string, string>()
        {
            { "a", "LC control number" },
            { "b", "NUCMC control number" },
            { "z", "Canceled/invalid LC control number" },
            { "8", "Field link and sequence number" }
        };

        public static Dictionary<string, string> PatentControlInformationMap = new Dictionary<string, string>()
        {
            { "a", "Patent Number" },
            { "b", "Patent Country" },
            { "c", "Type of Patent" },
            { "d", "Patent Date" },
            { "e", "Patent Status" },
            { "f", "Party to Patent Document" },
            { "6", "Patent Linkage" },
            { "8", "Patent Field Link/Sequence Number" }
        };

        public static Dictionary<string, string> NationalBibliographyNumber = new Dictionary<string, string>()
        {
            { "a", "National bibliography number" },
            { "q", "National bibliography qualifying information" },
            { "z", "Canceled/invalid national bibliography number" },
            { "2", "National bibliography number source" },
            { "6", "National bibliography number linkage" },
            { "8", "National bibliography number field link/Sequence Number" }
        };

        public static Dictionary<string, string> NationalBibliographicAgencyControlNumberMap = new Dictionary<string, string>()
        {
            { "a", "National Bibliographic Agency Control Number" },
            { "z", "Canceled/invalid National Bibliographic Agency Control Number" },
            { "2", "National Bibliographic Agency Control Number Source" },
            { "8", "National Bibliographic Agency Control Number Field Link/Sequence Number" }
        };

        public static Dictionary<string, string> SystemControlNumberMap = new Dictionary<string, string>()
        {
            { "a", "System Control Number" },
            { "z", "Canceled/invalid System Control Number" },
            { "6", "System Control Number Linkage" },
            { "8", "System Control Number Field Link/Sequence" }
        };

        public static Dictionary<string, string> CatalogingSourceMap = new Dictionary<string, string>()
        {
            { "a", "Original cataloging agency" },
            { "b", "Language of cataloging" },
            { "c", "Transcribing agency" },
            { "d", "Modifying agency" },
            { "e", "Description conventions" },
            { "6", "Cataloging source linkage" },
            { "8", "Cataloging source field link/sequence" }
        };

        public static Dictionary<string, string> LibraryOfCongressCallNumberMap = new Dictionary<string, string>()
        {
            { "a", "Call Number Classification" },
            { "b", "Call Number Item" },
            { "0", "Authority Record Control Number" },
            { "3", "Materials Specified" },
            { "6", "Call Number Linkage" },
            { "8", "Call Number Field Link/Sequence" }
        };

        public static Dictionary<string, string> PersonalNameMainEntry = new Dictionary<string, string>()
        {
            { "a", "Personal name" },
            { "b", "Personal name Numeration" },
            { "c", "Personal name Titles and words associated with a name" },
            { "d", "Personal name Dates associated with a name" },
            { "e", "Personal name Relator term" },
            { "f", "Personal name Date of a work" },
            { "g", "Personal name Miscellaneous information" },
            { "j", "Personal name Attribution qualifier" },
            { "k", "Personal name Form subheading" },
            { "l", "Personal name Language of a work" },
            { "n", "Personal name Number of part/section of a work" },
            { "p", "Personal name Name of part/section of a work" },
            { "q", "Personal name Fuller form of name" },
            { "t", "Personal name Title of a work" },
            { "u", "Personal name Affiliation" },
            { "0", "Personal name Authority record control number or standard number" },
            { "4", "Personal name Relationship" },
            { "6", "Personal name Linkage" },
            { "8", "Personal name Field link and sequence number" }
        };

        public static Dictionary<string, string> TitleStatementMap = new Dictionary<string, string>()
        {
            { "a", "Title" },
            { "b", "Remainder of title" },
            { "c", "Statement of responsibility, etc." },
            { "f", "Inclusive dates" },
            { "g", "Bulk dates" },
            { "h", "Medium" },
            { "k", "Form" },
            { "n", "Number of part/section of a work" },
            { "p", "Name of part/section of a work" },
            { "s", "Version" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" }
        };

        public static Dictionary<string, string> PublicationDistributionMap = new Dictionary<string, string>()
        {
            { "a", "Place of publication, distribution, etc." },
            { "b", "Name of publisher, distributor, etc." },
            { "c", "Date of publication, distribution, etc." },
            { "e", "Place of manufacture" },
            { "f", "Manufacturer" },
            { "g", "Date of manufacture" },
            { "3", "Materials specified" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" }
        };

        public static Dictionary<string, string> PhysicalDescriptionMap = new Dictionary<string, string>()
        {
            {"a", "Physical Description Extent" },
            {"b", "Physical Description Other physical details" },
            {"c", "Physical Description Dimensions" },
            {"e", "Physical Description Accompanying material" },
            {"f", "Physical Description Type of unit" },
            {"g", "Physical Description Size of unit" },
            {"3", "Physical Description Materials specified" },
            {"6", "Physical Description Linkage" },
            {"8", "Physical Description Field link and sequence number" }
        };

        public static Dictionary<string, string> GeneralNoteMap = new Dictionary<string, string>()
        {
            {"a", "General Note" },
            {"3", "General Note Materials Specified" }
        };

        public static Dictionary<string, string> SubjectAddedEntryTopicalTermMap = new Dictionary<string, string>()
        {
            { "a", "Topical term or geographic name entry element" },
            { "b", "Topical term following geographic name entry element" },
            { "c", "Location of event" },
            { "d", "Active dates" },
            { "e", "Relator term" },
            { "g", "Miscellaneous information" },
            { "v", "Form subdivision" },
            { "x", "General subdivision" },
            { "y", "Chronological subdivision" },
            { "z", "Geographic subdivision" },
            { "0", "Authority record control number or standard number" },
            { "2", "Source of heading or term" },
            { "3", "Materials specified" },
            { "4", "Relationship" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" },
        };

        public static Dictionary<string, string> AuthenticationCodeMap = new Dictionary<string, string>()
        {
            { "a", "Authentication Code" }
        };

        public static Dictionary<string, string> GeographicAreaCodeMap = new Dictionary<string, string>()
        {
            { "a", "Geographic area code" },
            { "b", "Local GAC code" },
            { "c", "ISO code" },
            { "0", "Authority record control number or standard number" },
            { "2", "Source of local code" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" }
        };

        public static Dictionary<string, string> ElectronicLocationAndAccessMap = new Dictionary<string, string>()
        {
            { "a", "Host name" },
            { "b", "Access number" },
            { "c", "Compression information" },
            { "d", "Path" },
            { "f", "Electronic name" },
            { "h", "Processor of request" },
            { "i", "Instruction" },
            { "j", "Bits per second" },
            { "k", "Password" },
            { "l", "Logon" },
            { "m", "Contact for access assistance" },
            { "n", "Name of location of host" },
            { "o", "Operating system" },
            { "p", "Port" },
            { "q", "Electronic format type" },
            { "r", "Settings" },
            { "s", "File size" },
            { "t", "Terminal emulation" },
            { "u", "Uniform Resource Identifier" },
            { "v", "Hours access method available" },
            { "w", "Record control number" },
            { "x", "Nonpublic note" },
            { "y", "Link text" },
            { "z", "Public note" },
            { "2", "Access method" },
            { "3", "Materials specified" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" }
        };

        public static Dictionary<string, string> SeriesStatementMap = new Dictionary<string, string>()
        {
            { "a", "Series statement" },
            { "l", "Library of Congress call number" },
            { "v", "Volume/sequential designation" },
            { "x", "International Standard Serial Number" },
            { "3", "Materials specified" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" }
        };

        public static Dictionary<string, string> AddedEntryPersonalName = new Dictionary<string, string>()
        {
            { "a", "Personal name" },
            { "b", "Numeration" },
            { "c", "Titles and other words associated with a name" },
            { "d", "Dates associated with a name" },
            { "e", "Relator term" },
            { "f", "Date of a work" },
            { "g", "Miscellaneous information" },
            { "h", "Medium" },
            { "i", "Relationship information" },
            { "j", "Attribution qualifier" },
            { "k", "Form subheading" },
            { "l", "Language of a work" },
            { "m", "Medium of performance for music" },
            { "n", "Number of part/section of a work" },
            { "o", "Arranged statement for music" },
            { "p", "Name of part/section of a work" },
            { "q", "Fuller form of name" },
            { "r", "Key for music" },
            { "s", "Version" },
            { "t", "Title of a work" },
            { "u", "Affiliation" },
            { "x", "International Standard Serial Number" },
            { "0", "Authority record control number or standard number" },
            { "3", "Materials specified" },
            { "4", "Relationship" },
            { "5", "Institution to which field applies" },
            { "6", "Linkage" },
            { "8", "Field link and sequence number" }
        };
    }
}
