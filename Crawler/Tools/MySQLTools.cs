using System;
using System.Collections.Generic;
using System.Text;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace LibraryOfCongressImport.Tools
{
    public static class MySQLTools
    {
        private static Dictionary<string, int> _existingAttributeTypes = null;

        private static Dictionary<string, int> GetAllAttributeTypes(ref MySqlConnection connection, bool refresh = false)
        {
            if (_existingAttributeTypes == null)
            {
                var command = new MySqlCommand();
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.CommandText = "get_all_attribute_types";
                command.Connection = connection;

                var response = command.ExecuteReader();
                var dt = new DataTable();
                dt.Load(response);

                _existingAttributeTypes = new Dictionary<string, int>();
                foreach(DataRow row in dt.Rows)
                {
                    int attributeID = int.Parse(row["id"].ToString());
                    string attributeName = row["name"].ToString();
                    _existingAttributeTypes.Add(attributeName, attributeID);
                }
            }
            return _existingAttributeTypes;
        }

        private static int AddAttributeType(string attributeType, ref MySqlConnection connection)
        {
            //todo: add to db
            //todo: add to dictionary
            return 0;
        }

        private static int GetOrCreateAttributeType(string attributeType, ref MySqlConnection connection, bool refresh = false)
        {
            int attributeTypeID;
            var hasAttributeType = GetAllAttributeTypes(ref connection).TryGetValue(attributeType, out attributeTypeID);

            if (!hasAttributeType)
            {
                attributeTypeID = AddAttributeType(attributeType, ref connection);
            }

            return attributeTypeID;
        }

        private static int GetOrCreateItem(string itemControlNumber, ref MySqlConnection connection)
        {
            //todo: add to db or get from db
            return 0;
        }

        private static void AddAttributeValueToItem(int item, int attributeType, string value, ref MySqlConnection connection)
        {
            //todo: add to or get from db
        }

        public static void PushItemToDatabase(ref Item item)
        {
            var connection = new MySqlConnection(Program.MySQLConnectionString);
            connection.Open();
            try
            {
                var itemID = GetOrCreateItem(item.GetItemIdentifier(), ref connection);
                foreach (var itemAttribute in item.Attributes)
                {
                    var attributeID = GetOrCreateAttributeType(itemAttribute.Key, ref connection);
                    AddAttributeValueToItem(itemID, attributeID, itemAttribute.Value, ref connection);
                }
            }
            catch (Exception)
            {
                // bad....
            }
            connection.Close();
        }
    }
}
