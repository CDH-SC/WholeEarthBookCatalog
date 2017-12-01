using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryOfCongressImport.Tools
{
    interface IDBTools
    {
        public static void PushItemToDatabase(ref Item item);
        public static string ExecuteScript(string script, int trialNumber = 0, int maxTrialNumber = 3);
        public static void ExecuteScripts(List<string> scripts, int trialNumber = 0, int maxTrialNumber = 3);
    }
}
