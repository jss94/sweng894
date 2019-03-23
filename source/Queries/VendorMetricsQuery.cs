
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


        public async Task<List<ReservationCountMetric>> GetMonthlyReservationCountMetricAsync(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = createReservationCountMetricQuery("%M");
                await Task.CompletedTask;

                try
                {
                    var result = connection.QueryAsync<ReservationCountMetric>(query, new { id }).Result.ToList();
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);

                }

                return null;
            }
        }

        public async Task<List<ReservationSalesMetric>> GetMonthlyReservationSalesMetricAsync(int vendorId)
        {
  
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = createReservationSalesMetricQuery("%M");

                await Task.CompletedTask;

                try
                {
                    var result = connection.QueryAsync<ReservationSalesMetric>(query, new { vendorId }).Result.ToList();
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);

                }

                return null;
            }

        }

        public async Task<List<ReservationSalesMetric>> GetWeekdayReservationSalesMetricAsync(int vendorId)
        {

            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = createReservationSalesMetricQuery("%W");

                await Task.CompletedTask;

                try
                {
                    var result = connection.QueryAsync<ReservationSalesMetric>(query, new { vendorId }).Result.ToList();
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);

                }

                return null;
            }

        }

        public async Task<List<ReservationCountMetric>> GetWeekdayReservationCountMetricAsync(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();
                
                string query = createReservationCountMetricQuery("%W");
                await Task.CompletedTask;

                try
                {
                    var result = connection.QueryAsync<ReservationCountMetric>(query, new { id }).Result.ToList();
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);

                }

                return null;
            }
        }

        private string createReservationCountMetricQuery(string dateFormatAbbreviation)
        {
            string query = @"select count(*) as 'reservationCount', DATE_FORMAT(dateTime, '" + dateFormatAbbreviation + "') as 'dateCategory'"
                    + " from occasions.events"
                    + " inner join"
                    + " occasions.reservations on reservations.eventId = events.guid"
                    + " inner join"
                    + " occasions.vendors on reservations.vendorId = vendors.id"
                    + " where vendorId = @id"
                    + " group by dateCategory";
            return query;

        }

        private string createReservationSalesMetricQuery(string dateFormatAbbreviation)
        {
            string query = @"select DATE_FORMAT(dateTime, '" + dateFormatAbbreviation + "') as 'dateCategory', vendorServices.serviceType, vendorServices.serviceName, vendorServices.price, vendorServices.flatFee, reservations.numberReserved"
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