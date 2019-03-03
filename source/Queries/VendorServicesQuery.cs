using Dapper;
using MySql.Data.MySqlClient;
using source.Database;
using source.Framework;
using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public class VendorServicesQuery: IVendorServicesQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase via dependency injection</param>
        public VendorServicesQuery(IAppDatabase db)
        {
            _database = db;
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
                return null;
            }
        }

        public async Task<List<VendorServices>> GetAll()
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT * FROM occasions.vendorServices WHERE active = 1;";

                    var result = connection.QueryAsync<VendorServices>(query).Result;
                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                return null;
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
                return null;
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
                return null;
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
                return null;
            }
        }

        public async Task<bool> DeactivateByServiceId(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendorServices "
                        + @"SET active = 0 WHERE id = @id AND active = 1;";

                    var result = connection.ExecuteAsync(query, new { id }).Result;
                    return true;
                }
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// Deactivate the specified id.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="id">Identifier.</param>
        public async Task<bool> DeactivateByVendorId(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendorServices "
                        + @"SET active = 0 WHERE vendorId = @id AND active = 1;";

                    await connection.ExecuteAsync(query, new { id });
                    return true;
                }
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// Reactivate the specified id.
        /// </summary>
        /// <returns>The reactivate.</returns>
        /// <param name="id">Identifier.</param>
        public async Task<bool> ReactivateByVendorId(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.vendorServices "
                        + @"SET active = 1 WHERE vendorId = @id AND active = 0;";

                    await connection.ExecuteAsync(query, new { id });
                    return true;
                }
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// Get a vendor service by vendor service id
        /// </summary>
        /// <param name="id">Vendor service id</param>
        /// <returns>Vendor service</returns>
        public async Task<VendorServices> GetById(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT * FROM occasions.vendorServices WHERE id = @id AND active = 1;";

                    var result = connection.QueryFirstAsync<VendorServices>(query, new { id }).Result;
                    return result;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<List<VendorServices>> Search(VendorSearchProperties properties)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT * FROM occasions.vendorServices "
                                + @" WHERE (active = 1 AND serviceType = @type AND price <= @maxPrice) "
                                + @"   AND (unitsAvailable >= @maxCapacity OR unitsAvailable IS NULL)";

                    var result = await connection.QueryAsync<VendorServices>(query, properties);
                    return result.ToList();
                }
            }
            catch(Exception ex)
            {
                return null;
            }
        }
    }
}
