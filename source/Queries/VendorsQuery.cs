using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Microsoft.AspNetCore.Mvc;
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
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT vendor_id, user_name, name, type, website, phone_number"
                    + @"FROM occasions.vendors"
                    + @"WHERE active = 1 ORDER BY user_name DESC;";
                
                var vendors = connection.QueryAsync<Vendor>(query).Result.ToList();
                return vendors;
            }
        }

        public async Task<Vendor> GetById(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT vendor_id, user_name, name, type, website, phone_number"
                    + @"FROM occasions.vendors"
                    + @"WHERE vendor_id = id AND active = 1;";

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

                string query = @"SELECT vendor_id, user_name, name, type, website, phone_number"
                    + @"FROM occasions.vendors"
                    + @"WHERE user_name = userName AND active = 1;";

                var vendor = connection.QueryFirstAsync<Vendor>(query).Result;
                return vendor;
            }
        }
    }
}