﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;

namespace source.Queries
{
    /// <summary>
    /// Vendors repository
    /// </summary>
    public class VendorsQuery : IVendorsQuery
    {
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase via dependency injection</param>
        public VendorsQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Gets a list of all vendors
        /// </summary>
        /// <returns>List of Vendor</returns>
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
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
            }
        }

        /// <summary>
        /// Gets a vendor record by vendor id
        /// </summary>
        /// <param name="id">Vendor id</param>
        /// <returns>Vendor</returns>
        public async Task<Vendor> GetById(int id)
        {
            try
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
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
            }
        }

        /// <summary>
        /// Gets a vendor record by username
        /// </summary>
        /// <param name="userName">Vendors username</param>
        /// <returns>Vendor</returns>
        public async Task<Vendor> GetByUserName(string userName)
        {
            try
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
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
            }
        }

        /// <summary>
        /// Inserts a new vendor record
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>New vendor record</returns>
        public async Task<Vendor> InsertVendor(Vendor vendor)
        {
            try
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
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
            }
        }

        /// <summary>
        /// Updates a vendor record
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>Updated vendor record</returns>
        public async Task<Vendor> UpdateVendor(Vendor vendor)
        {
            try
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
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
            }
        }

        /// <summary>
        /// Deactivates a vendor record
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>True/False</returns>
        public async Task<bool> DeactivateVendor(Vendor vendor)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendors "
                        + @"SET active = false "
                        + @"WHERE id = @id AND active = 1;";

                    var returnedValue = connection.QueryFirstAsync<Vendor>(query, vendor).Result;
                    if (returnedValue != null)
                        return true;
                    return false;
                }
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
            }
        }

    }
}