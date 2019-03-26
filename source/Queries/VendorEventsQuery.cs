
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;
using System;

namespace source.Queries
{
    /// <summary>
    /// Retrives Vendor Events from the Database
    /// </summary>
    public class VendorEventsQuery : IVendorEventsQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase supplied by dependency injection</param>
        public VendorEventsQuery(IAppDatabase db)
        {
            _database = db;
        }


        public async Task<List<VendorEvent>> GetVendorEvents(int vendorId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = createVendorEventsQuery();
                await Task.CompletedTask;

                try
                {
                    var result = connection.QueryAsync<VendorEvent>(query, new { vendorId }).Result.ToList();
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);

                }

                return null;
            }
        }

        private string createVendorEventsQuery()
        {
            string query = @"select vendorServices.serviceName, vendorServices.serviceType, DATE_FORMAT(dateTime, '%M-%d-%Y') as 'eventDate'"
                   + " from occasions.reservations"
                   + " inner join"
                   + " occasions.vendorServices on reservations.vendorServiceId = vendorServices.id"
                   + " inner join"
                   + " occasions.events on reservations.eventId = events.guid"
                   + " inner join"
                   + " occasions.vendors on vendors.id = reservations.vendorId"
                   + " where reservations.vendorId = @vendorId;";
            
            return query;
        }

    }
}