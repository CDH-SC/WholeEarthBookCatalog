using System;
using System.Collections.Generic;
using System.Text;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;
using System.Threading;

namespace LibraryOfCongressImport.Tools
{
    public static class MySQLTools
    {
        private static Dictionary<string, int> _existingAttributeTypes = null;

        private static readonly ReaderWriterLockSlim lockSlim = new ReaderWriterLockSlim();

        private static Dictionary<string, int> ExistingAttributeTypes
        {
            get
            {
                if (_existingAttributeTypes == null)
                {
                    ExistingAttributeTypes = GetAllAttributeTypes();
                }
                lockSlim.EnterReadLock();
                var dict = _existingAttributeTypes;
                lockSlim.ExitReadLock();
                return dict;
            }

            set
            {
                lockSlim.EnterWriteLock();
                _existingAttributeTypes = value;
                lockSlim.ExitWriteLock();
            }
        }
        
        private static Dictionary<string, int> GetAllAttributeTypes()
        {
            using (var connection = new MySqlConnection(Program.MySQLConnectionString))
            {
                var command = new MySqlCommand();
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.CommandText = "get_all_attribute_types";

                connection.Open();
                command.Connection = connection;

                command.CommandTimeout = 120;

                var dictionary = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

                try
                {
                    var response = command.ExecuteReader();
                    while (response.Read())
                    {
                        int attributeID = int.Parse(response["id"].ToString());
                        string attributeName = response["name"].ToString();
                        dictionary.Add(attributeName, attributeID);
                    }
                }
                catch (Exception)
                {
                    // no types pre-existing
                }
                finally
                {
                    connection.Close();
                }
                return dictionary;
            }

        }

        private static void AddAttributeType(string attributeType)
        {
            using (var connection = new MySqlConnection(Program.MySQLConnectionString))
            {
                var command = new MySqlCommand();
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.CommandText = "create_attribute_type";

                connection.Open();
                command.Connection = connection;

                command.CommandTimeout = 120;

                command.Parameters.Add("name", MySqlDbType.VarChar);
                command.Parameters["name"].Value = attributeType;

                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception)
                {

                }
                finally
                {
                    connection.Close();
                }

                ExistingAttributeTypes = null;
            }
        }

        private static int GetOrCreateAttributeType(string attributeType, bool refresh = false)
        {
            bool hasAttributeType = false;
            var dict = ExistingAttributeTypes;
            hasAttributeType = dict.ContainsKey(attributeType);
            if (!hasAttributeType)
            {
                AddAttributeType(attributeType);
            }
            return ExistingAttributeTypes[attributeType];
        }


        private static int GetOrCreateItem(string itemControlNumber)
        {
            using (var connection = new MySqlConnection(Program.MySQLConnectionString))
            {
                var command = new MySqlCommand();
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.CommandText = "create_item";

                connection.Open();
                command.Connection = connection;

                command.CommandTimeout = 120;

                command.Parameters.Add("control_number", MySqlDbType.VarChar);
                command.Parameters["control_number"].Value = itemControlNumber;

                int itemID = 0;

                try
                {
                    itemID = (int)command.ExecuteScalar();
                }
                catch (Exception)
                {

                }
                finally
                {
                    connection.Close();
                }

                return itemID;
            }
        }

        private static void AddAttributeValueToItem(int itemID, int attributeTypeID, string value)
        {
            using (var connection = new MySqlConnection(Program.MySQLConnectionString))
            {
                var command = new MySqlCommand();
                command.CommandType = System.Data.CommandType.StoredProcedure;

                command.CommandText = "create_item_attribute_value";

                connection.Open();
                command.Connection = connection;

                command.CommandTimeout = 120;

                command.Parameters.Add("item", MySqlDbType.Int32);
                command.Parameters["item"].Value = itemID;

                command.Parameters.Add("attribute_type", MySqlDbType.Int32);
                command.Parameters["attribute_type"].Value = attributeTypeID;

                command.Parameters.Add("attribute_value", MySqlDbType.Text);
                command.Parameters["attribute_value"].Value = value;

                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception)
                {

                }
                finally
                {
                    connection.Close();
                }
            }
        }

        public static void PushItemToDatabase(ref Item item)
        {
            try
            {
                var itemID = GetOrCreateItem(item.GetItemIdentifier());
                foreach (var itemAttribute in item.Attributes)
                {
                    var attributeID = GetOrCreateAttributeType(itemAttribute.Key);
                    AddAttributeValueToItem(itemID, attributeID, itemAttribute.Value);
                }
            }
            catch (Exception)
            {
                // bad....
            }
        }
    }
}
