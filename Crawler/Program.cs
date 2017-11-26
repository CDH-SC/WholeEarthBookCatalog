using LibraryOfCongressImport.Tools;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace LibraryOfCongressImport
{
    class Program
    {
        #region Configuration
        /// <summary>
        /// The connection to the database
        /// </summary>
        private const string Neo4jConnectionString = "";

        /// <summary>
        /// The page containing the list of items
        /// </summary>
        private const string ListSourceURL = "http://www.loc.gov/cds/products/MDSConnect-books_all.html";

        /// <summary>
        /// The format for requesting an item
        /// </summary>
        private const string ItemSourceURLFormat = "http://www.loc.gov/cds/downloads/MDSConnect/{0}";

        /// <summary>
        /// The pattern of an item
        /// </summary>
        private const string ItemPatternRegex = "BooksAll\\..{0,4}\\.part.{0,2}\\.xml\\.gz";

        /// <summary>
        /// This determines how many files to import at a time
        /// Expect 3gb of memory usage per degree
        /// </summary>
        private const int MaxImportParallelism = 1;
        #endregion

        /// <summary>
        /// Primary entry point
        /// </summary>
        static void Main()
        {
            LogTools.Log("Main", "Importing Library of Congress");
            Parallel.ForEach(FileUrls(), new ParallelOptions() { MaxDegreeOfParallelism = MaxImportParallelism }, (fileUrl) =>
            {
                ProcessFile(fileUrl);
                // force garbage collection
                GC.Collect();
                GC.WaitForPendingFinalizers();
            });
            LogTools.Log("Main", "Import Complete");
        }

        private static IEnumerable<string> FileUrls()
        {
            var htmlList = WebTools.GetHttpFromURL(ListSourceURL);
            var regex = new Regex(ItemPatternRegex, RegexOptions.Compiled);
            var matches = regex.Matches(htmlList);
            foreach (var match in matches)
                yield return String.Format(ItemSourceURLFormat, match);
        }

        private static void ProcessFile(string fileUrl)
        {
            LogTools.Log("ProcessFile", fileUrl);
            var xml = WebTools.GetXMLFromGZCompressedFromURL(fileUrl);
            AddFileDataToDatabase(ref xml);
        }

        private static void AddFileDataToDatabase(ref XDocument xml)
        {
            foreach (var entry in xml.Root.Elements())
            {
                AddRecord(entry);
            }
        }

        private static void AddRecord(XElement record)
        {
            LogTools.Log("AddRecord", "New Record");
            var item = new Item(ref record);
            DBTools.PushItemToDatabase(ref item);
        }
    }
}
