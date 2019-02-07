using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;
using source.Framework;

namespace source.Queries
{
    /// <summary>
    /// Vendors repository
    /// </summary>
    public class VendorsQuery : IVendorsQuery
    {
        /// <summary>
        /// database object
        /// </summary>
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
        public async Task<List<Vendor>> GetAll()
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query = @"SELECT * from occasions.vendors WHERE active = 1; "
                        + @"SELECT * from occasions.vendorServices WHERE active = 1";

                    var result = await connection.QueryMultiple(query).Map<Vendor, VendorServices, int?>
                        (vendor => vendor.id, vendorsevices => vendorsevices.vendorId,
                        (vendor, vendorservices) => {
                        vendor.services = vendorservices.ToList(); 
                    });
                        
                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                return new List<Vendor>();
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
                    string query = @"SELECT * from occasions.vendors WHERE id = @id and active = 1; "
                        + @"SELECT * from occasions.vendorServices WHERE active = 1";

                    var result = await connection.QueryMultiple(query, new { id = id }).Map<Vendor, VendorServices, int?>
                        (vendor => vendor.id, vendorsevices => vendorsevices.vendorId,
                        (vendor, vendorservices) => {
                            vendor.services = vendorservices.ToList();
                      });

                    return result.FirstOrDefault();
                }
            }
            catch (Exception)
            {
                return new Vendor();
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
                    string query = @"SELECT * from occasions.vendors WHERE userName = @userName and active = 1; "
                        + @"SELECT * from occasions.vendorServices WHERE active = 1";

                    var result = await connection.QueryMultiple(query, new { userName = userName }).Map<Vendor, VendorServices, int?>
                        (vendor => vendor.id, vendorsevices => vendorsevices.vendorId,
                        (vendor, vendorservices) => {
                            vendor.services = vendorservices.ToList();
                        });

                    return result.FirstOrDefault();
                }
            }
            catch (Exception)
            {
                return new Vendor();
            }
        }

        /// <summary>
        /// Inserts a new vendor record; if services are added as part of the vendor, adds services to vendor
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>New vendor record</returns>
        public async Task<Vendor> Insert(Vendor vendor)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.vendors "
                        + @"(id, userName, name, type, addressId, website, phone, active) "
                        + @"VALUES(@id, @userName, @name, @type, @addressId, @website, @phone, 1); "
                        + @"SELECT * FROM occasions.vendors WHERE id = LAST_INSERT_ID() AND active = 1;";

                    var newVendor = connection.QueryFirstAsync<Vendor>(query, vendor).Result;

                    //If services are added at the same time as vendor, add services
                    foreach (VendorServices v in vendor.services)
                    {
                        v.vendorId = newVendor.id.Value;
                        string servicesQuery = @"INSERT INTO occasions.vendorServices "
                            + @"(vendorId, serviceType, serviceName, serviceDescription, flatFee, price, unitsAvailable, active) "
                            + @"VALUES(@vendorId, @serviceType, @serviceName, @serviceDescription, @flatFee, @price, @unitsAvailable, 1); ";

                        var addedService = connection.ExecuteAsync(servicesQuery, v).Result;
                    }

                    var returnedVendor = await GetById(newVendor.id.Value);
                    return returnedVendor;
                }
            }
            catch (Exception)
            {
                return new Vendor();
            }
        }

        /// <summary>
        /// Updates a vendor record
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>Updated vendor record</returns>
        public async Task<Vendor> Update(Vendor vendor)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendors "
                        + @"SET name = @name, type = @type, addressId = @addressId, website = @website, phone = @phone "
                        + @"WHERE id = @id; "
                        + @"SELECT * FROM occasions.vendors WHERE id = @id AND active = 1;";

                    var returnedVendor = connection.QueryFirstAsync<Vendor>(query, vendor).Result;
                    return returnedVendor;
                }
            }
            catch (Exception)
            {
                return new Vendor();
            }
        }

        /// <summary>
        /// Deactivates a vendor record and all associated services
        /// </summary>
        /// <param name="id">Vendor ID</param>
        /// <returns>True/False</returns>
        public async Task<bool> Deactivate(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendors "
                        + @"SET active = 0 "
                        + @"WHERE id = @id AND active = 1;"
                        + @"UPDATE occasions.vendorServices "
                        + @"SET active = 0 WHERE vendorId = @id;";

                    var returnedValue = connection.QueryAsync<Vendor>(query, new { id });
                    return true;                   
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Delete the specified vendor.
        /// </summary>
        /// <returns>The delete.</returns>
        /// <param name="id">Vendor ID.</param>
        public async Task<bool> Delete(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.vendors "
                    + @"WHERE id = @id AND active = 1;"
                    + @"DELETE FROM occasions.vendorServices "
                    + @"WHERE vendorId = @id;";

                var returnedValue = connection.QueryAsync<Vendor>(query, new { id });
                return true;
            }
        }

    }
}