
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;
using System.Threading;
using System;

namespace source.Queries
{
    /// <summary>
    /// Retrives Vendor Metrics from the Database
    /// </summary>
    public class VendorMetricsQuery : IVendorMetricsQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase supplied by dependency injection</param>
        public VendorMetricsQuery(IAppDatabase db)
        {
            _database = db;
        }

        
        public async Task<List<MonthlyMetric>> GetMonthlyReservationMetricAsync(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();
                /*
                 select vendors.name, count(*) as "Count of Monthly Reservations", DATE_FORMAT(dateTime, "%Y-%m-01") as "Month"
                    from events 
                    inner join 
                    reservations on reservations.eventId=events.eventId+ 
                    inner join
                    vendors on reservations.vendorId = vendors.id
                    where vendorId = 1
                    group by DATE_FORMAT(dateTime, "%Y-%m-01");
                    */
                string query = @"select count(*) as 'reservationCount', DATE_FORMAT(dateTime, '%Y-%m-01') as 'month'"
                    + " from occasions.events"
                    + " inner join"
                    + " occasions.reservations on reservations.eventId = events.eventId"
                    + " inner join"
                    + " occasions.vendors on reservations.vendorId = vendors.id"
                    + " where vendorId = @id"
                    + " group by month";

                Console.WriteLine(">>>" + query);

                await Task.CompletedTask;

                try
                {
                    var result = connection.QueryAsync<MonthlyMetric>(query, new { id }).Result.ToList();
                    return result;
                } catch (Exception e)
                {
                    Console.WriteLine(e);
                    
                }

                return null;
            }
        }
    }
}