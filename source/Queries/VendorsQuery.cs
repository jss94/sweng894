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
            catch (Exception ex)
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

            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();
                var query = @"SELECT * FROM occasions.vendors WHERE userName = @userName AND active = 1; "
                    + @"SELECT * FROM occasions.vendorServices WHERE active = 1";

                var vendorResult = await connection.QueryMultiple(query, new { userName })
                .Map<Vendor, VendorServices, int?>
                    (v => v.id, s => s.vendorId,
                    (v, s) =>
                    {
                        v.services = s.ToList();
                    });

                var vendor = vendorResult.FirstOrDefault();

                if (vendor == null) return null;

                var addressQuery = @"SELECT * FROM occasions.addresses "
                    + @"WHERE userName = @userName AND active = 1;";

                var address = await connection.QueryFirstAsync<Address>(addressQuery, new { userName });
                vendor.address = address;

                return vendor;
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
                        + @"(userName, name, type, addressId, website, phone, active) "
                        + @"VALUES(@userName, @name, @type, @addressId, @website, @phone, 1); "
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
            catch (Exception ex)
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
            catch (Exception ex)
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
            catch (Exception ex)
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
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"DELETE FROM occasions.vendorServices "
                        + @"WHERE vendorId = @id; "
                        + @"DELETE FROM occasions.vendors "
                        + @"WHERE id = @id AND active = 1;";

                    var returnedValue = connection.ExecuteAsync(query, new { id });
                    return true;
                }
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// Gets vendors based on service type desired
        /// </summary>
        /// <param name="serviceType">Service type</param>
        /// <returns>List of vendor</returns>
        public async Task<List<Vendor>> GetVendorsByServiceTypes(string serviceType)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query = @"SELECT * from occasions.vendors WHERE active = 1 AND id IN (SELECT vendorId from occasions.vendorServices WHERE serviceType = @serviceType AND active = 1); "
                        + @"SELECT * from occasions.vendorServices WHERE serviceType = @serviceType AND active = 1";

                    var result = await connection.QueryMultiple(query, new { serviceType }).Map<Vendor, VendorServices, int?>
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
        /// Inserts vendor service
        /// </summary>
        /// <param name="service">Vendor service</param>
        /// <returns>Saved vendor service</returns>
        public async Task<VendorServices> InsertService(VendorServices service)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.vendorServices (vendorId, serviceType, serviceName, serviceDescription, flatFee, price, unitsAvailable, active) "
                        + @"VALUES (@vendorId, @serviceType, @serviceName, @serviceDescription, @flatFee, @price, @unitsAvailable, 1); "
                        + @"SELECT * FROM occasions.vendorServices WHERE id = LAST_INSERT_ID();";

                    var addedService = connection.QueryAsync<VendorServices>(query, service).Result;
                    return addedService.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                return new VendorServices();
            }
        }

        /// <summary>
        /// Updates vendor service
        /// </summary>
        /// <param name="service">Updated vendor service</param>
        /// <returns>Saved vendor service</returns>
        public async Task<VendorServices> UpdateService(VendorServices service)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendorServices "
                        + @"SET serviceType = @serviceType, serviceName = @serviceName, serviceDescription = @serviceDescription, "
                        + @"flatFee = @flatFee, price = @price, unitsAvailable = @unitsAvailable "
                        + @"WHERE vendorId = @vendorId AND id = @id; "
                        + @"SELECT * FROM occasions.vendorServices WHERE id = @id;";

                    var updatedService = connection.QueryFirstAsync<VendorServices>(query, service).Result;
                    return updatedService;
                }
            }
            catch (Exception ex)
            {
                return new VendorServices();
            }
        }

        /// <summary>
        /// Gets all active services of a vendor
        /// </summary>
        /// <param name="id">Vendor's id</param>
        /// <returns>List of vendor services</returns>
        public async Task<List<VendorServices>> GetServicesByVendor(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query = @"SELECT * from occasions.vendorServices "
                    + @"WHERE vendorId = @id AND active = 1";

                    var result = await connection.QueryAsync<VendorServices>(query, new { id });

                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                return new List<VendorServices>();
            }
        }

        public async Task<bool> DeactivateService(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendorServices "
                        + @"SET active = 0 WHERE id = @id;";
                        
                    var result = connection.ExecuteAsync(query, new { id }).Result;
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}