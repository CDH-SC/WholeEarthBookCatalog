using LibraryOfCongressImport.Tools;
using System.Collections.Generic;
using System.Xml.Linq;

namespace LibraryOfCongressImport
{
    public class Item
    {
        public List<ItemAttribute> Attributes = new List<ItemAttribute>();

        public Item(ref XElement record)
        {
            LogTools.Log("Item.Constructor", "Building New Item");
            foreach (var element in record.Elements())
                ItemAttribute.ParseAttributes(element, ref Attributes);
        }
    }
}
