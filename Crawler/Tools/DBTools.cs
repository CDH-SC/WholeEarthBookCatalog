using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryOfCongressImport.Tools
{
    public static class DBTools
    {
        public static void PushItemToDatabase(ref Item item)
        {
            // create/locate item based on some identifying feature
            // get id
        }

        private static void PushItemAttributesToDatabase(ref Item item)
        {
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
