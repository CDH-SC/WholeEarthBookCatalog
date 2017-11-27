using System;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Xml.Linq;

namespace LibraryOfCongressImport.Tools
{
    public static class WebTools
    {
        public static string GetHttpFromURL(string url)
        {
            LogTools.Log("GetHttpFromURL", url);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            try
            {
                WebResponse webResponse = request.GetResponseAsync().Result;
                using (Stream webStream = webResponse.GetResponseStream())
                {
                    if (webStream != null)
                    {
                        using (StreamReader responseReader = new StreamReader(webStream))
                        {
                            string response = responseReader.ReadToEnd();
                            return response;
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return null;
        }

        public static XDocument GetXMLFromGZCompressedFromURL(string url)
        {
            LogTools.Log("GetXMLFromGZCompressedFromURL", url);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            try
            {
                // Stream based for memory concerns
                WebResponse webResponse = request.GetResponseAsync().Result;
                using (Stream compressedFile = webResponse.GetResponseStream())
                using (GZipStream gzStream = new GZipStream(compressedFile, CompressionMode.Decompress))
                using (StreamReader decompressedStream = new StreamReader(gzStream))
                {
                    //All streams dispose after XDocument.Load terminiates, should keep memory use low.... lower
                    return XDocument.Load(decompressedStream);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
