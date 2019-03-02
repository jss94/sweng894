using Dapper;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public class ReservationsQuery : IReservationsQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Vendors query
        /// </summary>
        private IVendorsQuery _vendorsQuery;

        /// <summary>
        /// Vendor services query
        /// </summary>
        private IVendorServicesQuery _vendorServicesQuery;

        /// <summary>
        /// Event query
        /// </summary>
        private IEventQuery _eventQuery;



        /// <summary>
        /// Constructors
        /// </summary>
        /// <param name="database">Database object provided by dependency injection</param>
        /// <param name="vendorsQuery">Vendor query object provided by dependency injection</param>
        /// <param name="vendorServicesQuery">Vendor services query object provided by dependency injection</param>
        /// <param name="eventQuery">Event query object provided by dependency injection</param>
        public ReservationsQuery(IAppDatabase database, IVendorsQuery vendorsQuery, IVendorServicesQuery vendorServicesQuery, IEventQuery eventQuery)
        {
            _database = database;
            _vendorsQuery = vendorsQuery;
            _vendorServicesQuery = vendorServicesQuery;
            _eventQuery = eventQuery;
        }

        /// <summary>
        /// Gets all active reservations
        /// </summary>
        /// <returns>List of reservations</returns>
        public async Task<List<Reservation>> GetAll()
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query =
                          @"SELECT * from occasions.reservations WHERE active = 1;";

                    var reservationResult = await connection.QueryAsync<Reservation>(query);
                    foreach(Reservation res in reservationResult)
                    {
                        await MapObjectsToReservation(res);
                    }

                    return reservationResult.ToList();
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Inserts a new reservation
        /// </summary>
        /// <param name="reservation">Reservation</param>
        /// <returns>Saved reservation</returns>
        public async Task<Reservation> Insert(Reservation reservation)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.reservations(userName, eventId, vendorId, vendorServiceId, status, numberReserved, active) "
                        + @"VALUES(@userName, @eventId, @vendorId, @vendorServiceId, 'New', @numberReserved, 1); "
                        + @"SELECT * FROM occasions.reservations WHERE id = LAST_INSERT_ID() AND active = 1;";

                    var reserved = (await connection.QueryAsync<Reservation>(query, reservation)).FirstOrDefault();
                    if(reserved != null)
                    {
                        reserved.evt = await _eventQuery.GetEventById(reserved.eventId.Value);
                        reserved.vendor = await _vendorsQuery.GetById(reserved.vendorId.Value);
                        reserved.vendorService = await _vendorServicesQuery.GetById(reserved.vendorServiceId.Value);
                    }

                    return reserved;
                }
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Updates a reservation
        /// </summary>
        /// <param name="reservation">Reservation</param>
        /// <returns>Saved reservation</returns>
        public async Task<Reservation> Update(Reservation reservation)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.reservations "
                        + @"SET userName = @userName, eventId = @eventId, vendorId = @vendorId, vendorServiceId = @vendorServiceId, status = @status, numberReserved = @numberReserved "
                        + @"WHERE id = @id; "
                        + @"SELECT * FROM occasions.reservations WHERE id = @id;";

                    var reserved = (await connection.QueryAsync<Reservation>(query, reservation)).FirstOrDefault();
                    if (reserved != null)
                    {
                        reserved.evt = await _eventQuery.GetEventById(reserved.eventId.Value);
                        reserved.vendor = await _vendorsQuery.GetById(reserved.vendorId.Value);
                        reserved.vendorService = await _vendorServicesQuery.GetById(reserved.vendorServiceId.Value);
                    }

                    return reserved;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Gets all active reservations for a vendor
        /// </summary>
        /// <param name="vendorId">Vendor Id</param>
        /// <returns>List of reservations</returns>
        public async Task<List<Reservation>> GetByVendor(int vendorId)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query =
                          @"SELECT * from occasions.reservations WHERE active = 1 AND vendorId = @vendorId;";

                    var reservationResult = await connection.QueryAsync<Reservation>(query, new { vendorId });
                    foreach (Reservation res in reservationResult)
                    {
                        await MapObjectsToReservation(res);
                    }

                    return reservationResult.ToList();
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Gets all active reservations for a user
        /// </summary>
        ///<param name="userName">UserName</param>
        /// <returns>List of reservations</returns>
        public async Task<List<Reservation>> GetByUserName(string userName)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query =
                          @"SELECT * from occasions.reservations WHERE active = 1 AND userName = @userName;";

                    var reservationResult = await connection.QueryAsync<Reservation>(query, new { userName });
                    foreach (Reservation res in reservationResult)
                    {
                        await MapObjectsToReservation(res);
                    }

                    return reservationResult.ToList();
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private async Task MapObjectsToReservation(Reservation reservation)
        {
            reservation.vendor = await _vendorsQuery.GetById(reservation.vendorId.Value);
            reservation.vendorService = await _vendorServicesQuery.GetById(reservation.vendorServiceId.Value);
            reservation.evt = await _eventQuery.GetEventById(reservation.eventId.Value);
        }
    }
}
