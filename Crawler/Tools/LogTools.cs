using System;

namespace LibraryOfCongressImport.Tools
{
#if false
    public static class LogTools
    {
        public static void Log(string methodName, string message) => Console.WriteLine($">> {methodName}(): {message}");
        
        public static void LogNewAttribute(string methodName, ItemAttribute attribute) => Console.WriteLine($">> {methodName}(): \"{attribute.Key}\":\"{attribute.Value}\"");

        public static void LogUnknownTag(string methodName, string tagNumber) => Console.WriteLine($">> [Unknown Tag] >> {methodName}(): {tagNumber}");
    }
#endif

#if true
    public static class LogTools
    {
        public static void Log(string methodName, string message) { }

        public static void LogNewAttribute(string methodName, ItemAttribute attribute) { }

        public static void LogUnknownTag(string methodName, string tagNumber) { }
    }
#endif
}
