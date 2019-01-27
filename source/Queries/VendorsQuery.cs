using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;

namespace source.Queries
{
    public class VendorsQuery : IVendorsQuery
    {

        public readonly IAppDatabase _database;
        public VendorsQuery(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<List<Vendor>> GetAllAsync()
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT id, userName, name, type, website, phoneNumber "
                        + @"FROM occasions.vendors "
                        + @"WHERE active = 1 ORDER BY user_name DESC;";

                    var vendors = connection.QueryAsync<Vendor>(query).Result.ToList();
                    return vendors;
                }
            }
            catch (Exception ex)
            {
                var thing = ex.Message;
                var otherthing = ex.InnerException;
            }
            return null;
        }

        public async Task<Vendor> GetById(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT id, userName, name, type, website, phoneNumber "
                    + @"FROM occasions.vendors "
                    + @"WHERE id = id AND active = 1;";

                var vendor = connection.QueryFirstAsync<Vendor>(query).Result;
                return vendor;
            }
        }

        public async Task<Vendor> GetByUserName(string userName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT id, userName, name, type, website, phoneNumber "
                    + @"FROM occasions.vendors "
                    + @"WHERE userName = userName AND active = 1;";

                var vendor = connection.QueryFirstAsync<Vendor>(query).Result;
                return vendor;
            }
        }

        public async Task<Vendor> InsertVendor(Vendor vendor)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"INSERT INTO occasions.vendors "
                    + @"(id, userName, name, type, addressId, website, phoneNumber, active) "
                    + @"VALUES(@id, @userName, @name, @type, @addressId, @website, @phoneNumber, 1); "
                    + @"SELECT * FROM occasions.vendors WHERE id = LAST_INSERT_ID() AND active = 1;";

                var returnedVendor = connection.QueryFirstAsync<Vendor>(query, vendor).Result;
                return returnedVendor;
            }
        }

        public async Task<Vendor> UpdateVendor(Vendor vendor)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.vendors "
                    + @"SET name = @name, type = @type, addressId = @addressId, website = @website, phoneNumber = @phoneNumber) "
                    + @"WHERE id = @id; "
                    + @"SELECT * FROM occasions.vendors WHERE id = @id AND active = 1;";

                var returnedVendor = connection.QueryFirstAsync<Vendor>(query, vendor).Result;
                return returnedVendor;
            }
        }

        public async Task<Vendor> DeactivateVendor(Vendor vendor)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.vendors "
                    + @"SET active = false "
                    + @"WHERE id = @id; "
                    + @"SELECT * FROM occasions.vendors WHERE id = @id AND active = 1;";

                var returnedVendor = connection.QueryFirstAsync<Vendor>(query, vendor).Result;
                return returnedVendor;
            }
        }

    }
}