using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryOfCongressImport.Lookups
{
    public static class AttributeMaps
    {
        public static Dictionary<char, string> BibliographicLevelMap = new Dictionary<char, string>()
        {
            { 'a', "Monographic Component Part" },
            { 'b', "Serial Component Part" },
            { 'c', "Collection" },
            { 'd', "Subunit" },
            { 'i', "Integrating Resorce" },
            { 'm', "Monograph or Item" },
            { 's', "Serial" },
            { ' ', "" }
        };

        public static Dictionary<char, string> RecordStatusTypeMap = new Dictionary<char, string>()
        {
            { 'a', "Increase in Encoding Level" },
            { 'c', "Corrected or Revised" },
            { 'd', "Deleted" },
            { 'n', "New" },
            { 'p', "Increase In Encoding Level from Prepublication" },
            { ' ', "" }
        };

        public static Dictionary<char, string> SpecificRecordTypeMap = new Dictionary<char, string>()
        {
            { 'a', "Language Material" },
            { 'c', "Notated Music" },
            { 'd', "Manuscript Notated Music" },
            { 'e', "Cartographic Material" },
            { 'f', "Manuscript Cartographic Material" },
            { 'g', "Projected Medium" },
            { 'i', "Nonmusical Sound Recording" },
            { 'j', "Musical Sound Recording" },
            { 'k', "Two-Dimensional Nonprojectable Graphic" },
            { 'm', "Computer File" },
            { 'o', "Kit" },
            { 'p', "Mixed Material" },
            { 'r', "Three-dimensional Artifact or Naturally Occurring Object" },
            { 's', "Serial or Integrating Resource" },
            { 't', "Manuscript Language Material" },
            { ' ', "" }
        };

        public static class GenericRecordTypes
        {
            public const string Book = "Book";
            public const string Music = "Music";
            public const string Map = "Map";
            public const string VisualMaterials = "Visual Materials";
            public const string MixedMaterials = "Mixed Materials";
            public const string ComputerFile = "Computer File";
            public const string ContinuingResource = "Continuing Resource";
        }

        public static Dictionary<char, string> GenericRecordTypeMap = new Dictionary<char, string>()
        {
            { 'a', GenericRecordTypes.Book },
            { 'c', GenericRecordTypes.Music },
            { 'd', GenericRecordTypes.Music },
            { 'e', GenericRecordTypes.Map },
            { 'f', GenericRecordTypes.Map },
            { 'g', GenericRecordTypes.VisualMaterials },
            { 'i', GenericRecordTypes.Music },
            { 'j', GenericRecordTypes.Music },
            { 'k', GenericRecordTypes.VisualMaterials },
            { 'm', GenericRecordTypes.ComputerFile },
            { 'o', GenericRecordTypes.VisualMaterials },
            { 'p', GenericRecordTypes.MixedMaterials },
            { 'r', GenericRecordTypes.VisualMaterials },
            { 's', GenericRecordTypes.ContinuingResource },
            { 't', GenericRecordTypes.Book },
            { ' ', "" }
        };

        public static Dictionary<char, string> ControlTypeMap = new Dictionary<char, string>()
        {
            {'a', "Archival" },
            {' ', "" }
        };

        public static Dictionary<char, string> MultipartResourceRecordLevelMap = new Dictionary<char, string>()
        {
            { 'a', "Set" },
            { 'b', "Part with Independent Title" },
            { 'c', "Part with Dependent Title" },
            { ' ', "" }
        };

        public static Dictionary<char, string> TypeOfDateOrPublicationStatusMap = new Dictionary<char, string>()
        {
            { 'b', "No dates given; B.C. date involved" },
            { 'c', "Continuing resource currently published" },
            { 'd', "Continuing resource ceased publication" },
            { 'e', "Detailed date" },
            { 'i', "Inclusive dates of collection" },
            { 'k', "Range of years of bulk of collection" },
            { 'm', "Multiple dates" },
            { 'n', "Dates unknown" },
            { 'p', "Date of distribution/release/issue and production/recording session when different" },
            { 'q', "Questionable date" },
            { 'r', "Reprint/reissue date and original date" },
            { 's', "Single known date/probable date" },
            { 't', "Publication date and copyright date" },
            { 'u', "Continuing resource status unknown" },
            { '|', "No attempt to code" },
            { ' ', ""}
        };

        public static Dictionary<char, string> ModifiedRecordTypeMap = new Dictionary<char, string>()
        {
            { '#', "Not modified" },
            { 's', "Shortened" },
            { 'd', "Dashed-on information omitted" },
            { 'x', "Missing characters" },
            { 'r', "Completely romanized/printed cards in script" },
            { 'o', "Completely romanized/printed cards romanized" },
            { ' ', ""}
        };

        public static Dictionary<char, string> CatalogingSourceMap = new Dictionary<char, string>()
        {
            { '#', "NationalBibliographicAgency" },
            { 'c', "CooperativeCatalogingProgram" },
            { 'd', "Other" },
            { 'u', "Unknown" },
            { ' ', "" }
        };

        public static Dictionary<char, string> IllustrationsMap = new Dictionary<char, string>()
        {
            { '#', "No illustrations" },
            { 'a', "Illustrations" },
            { 'b', "Maps" },
            { 'c', "Portraits" },
            { 'd', "Charts" },
            { 'e', "Plans" },
            { 'f', "Plates" },
            { 'g', "Music" },
            { 'h', "Facsimiles" },
            { 'i', "Coats of arms" },
            { 'j', "Genealogical tables" },
            { 'k', "Forms" },
            { 'l', "Samples" },
            { 'm', "Phonodisc, phonowire, etc." },
            { 'o', "Photographs" },
            { 'p', "Illuminations" },
            { '|', "No attempt to code" },
            { ' ', "" },
        };

        public static Dictionary<char, string> TargetAudienceMap = new Dictionary<char, string>()
        {
            { '#', "Unknown or not specified" },
            { 'a', "Preschool" },
            { 'b', "Primary" },
            { 'c', "Pre-adolescent" },
            { 'd', "Adolescent" },
            { 'e', "Adult" },
            { 'f', "Specialized" },
            { 'g', "General" },
            { 'j', "Juvenile" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> FormOfBookMap = new Dictionary<char, string>()
        {
            { '#', "None of the following" },
            { 'a', "Microfilm" },
            { 'b', "Microfiche" },
            { 'c', "Microopaque" },
            { 'd', "Large print" },
            { 'f', "Braille" },
            { 'o', "Online" },
            { 'q', "Direct electronic" },
            { 'r', "Regular print reproduction" },
            { 's', "Electronic" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> NatureOfContentsOfBookMap = new Dictionary<char, string>()
        {
            { '#', "No specified nature of contents" },
            { 'a', "Abstracts/summaries" },
            { 'b', "Bibliographies" },
            { 'c', "Catalogs" },
            { 'd', "Dictionaries" },
            { 'e', "Encyclopedias" },
            { 'f', "Handbooks" },
            { 'g', "Legal articles" },
            { 'i', "Indexes" },
            { 'j', "Patent document" },
            { 'k', "Discographies" },
            { 'l', "Legislation" },
            { 'm', "Theses" },
            { 'n', "Surveys of literature in a subject area" },
            { 'o', "Reviews" },
            { 'p', "Programmed texts" },
            { 'q', "Filmographies" },
            { 'r', "Directories" },
            { 's', "Statistics" },
            { 't', "Technical reports" },
            { 'u', "Standards/specifications" },
            { 'v', "Legal cases and case notes" },
            { 'w', "Law reports and digests" },
            { 'y', "Yearbooks" },
            { 'z', "Treaties" },
            { '2', "Offprints" },
            { '5', "Calendars" },
            { '6', "Comics/graphic novels" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> GovernmentPublicationOfBookMap = new Dictionary<char, string>()
        {
            { '#', "Not a government publication" },
            { 'a', "Autonomous or semi-autonomous component" },
            { 'c', "Multilocal" },
            { 'f', "Federal/national" },
            { 'i', "International intergovernmental" },
            { 'l', "Local" },
            { 'm', "Multistate" },
            { 'o', "Government publication-level undetermined" },
            { 's', "State, provincial, territorial, dependent, etc." },
            { 'u', "Unknown if item is government publication" },
            { 'z', "Other" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> ConferencePublicationOfBookMap = new Dictionary<char, string>()
        {
            { '0', "Not a conference publication" },
            { '1', "Conference publication" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> FestschriftOfBookMap = new Dictionary<char, string>()
        {
            { '0', "Not a festschrift" },
            { '1', "Festschrift" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> IndexOfBookMap = new Dictionary<char, string>()
        {
            { '0', "No index" },
            { '1', "Index present" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> LiteraryFormOfBookMap = new Dictionary<char, string>()
        {
            { '0', "Not fiction (not further specified)" },
            { '1', "Fiction (not further specified)" },
            { 'd', "Dramas" },
            { 'e', "Essays" },
            { 'f', "Novels" },
            { 'h', "Humor, satires, etc." },
            { 'i', "Letters" },
            { 'j', "Short stories" },
            { 'm', "Mixed forms" },
            { 'p', "Poetry" },
            { 's', "Speeches" },
            { 'u', "Unknown" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };

        public static Dictionary<char, string> BiographyOfBookMap = new Dictionary<char, string>()
        {
            { '#', "No biographical material" },
            { 'a', "Autobiography" },
            { 'b', "Individual biography" },
            { 'c', "Collective biography" },
            { 'd', "Contains biographical information" },
            { '|', "No attempt to code" },
            { ' ', "" }
        };
    }
}
