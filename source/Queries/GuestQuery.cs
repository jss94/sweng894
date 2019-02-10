using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using Dapper;
using System.Threading.Tasks;

namespace source.Queries
{
    /// <summary>
    /// Guest Repository
    /// </summary>
    public class GuestQuery : IGuestQuery
    {
        /// <summary>
        /// DB Object
        /// </summary>
        public readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">DB used to pull guests</param>
        public GuestQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Get a list of guests by event
        /// </summary>
        /// <param name="eventId">DB id of the event you want to search for</param>
        /// <returns>List of guests</returns>
        public async Task<List<Guest>> GetListByEventId(int eventId)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    //string query = @"SELECT guestId, firstName, lastName, email, isGoing, eventId"
                    //    + @"FROM occasions.guests "
                    //    + "WHERE eventId = @eventId;";

                    string query = @"SELECT * FROM occasions.guests WHERE eventId = @eventId";

                    var guests = connection.QueryAsync<Guest>(query, new { eventId }).Result.ToList();
                    return guests;
                }
            }
            catch (Exception)
            {
                // TODO: Traditional Logging
                return new List<Guest>();
            }
        }

        /// <summary>
        /// Add a guest to the DB
        /// </summary>
        /// <param name="guest">Person being added</param>
        /// <returns>The guest back after successful addition</returns>
        public async Task<Guest> Insert(Guest guest)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"INSERT INTO occasions.guests (name, email, isGoing, eventId) "
                    + @"VALUES (@name, @email, @isGoing, @eventId)";

                Guest guestReturn = connection.QueryAsync<Guest>(query, guest).Result.ToList().FirstOrDefault();
                return guestReturn;
            }

        }

        /// <summary>
        /// Update a guest information
        /// </summary>
        /// <param name="guest">guest information going to be updated</param>
        /// <returns></returns>
        public async Task<Guest> Update(Guest guest)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.guests SET firstName = @guest.name, "
                    + @"email = @guest.email, "
                    + @"isGoing = @guest.isGoing "
                    + @"eventId =  @guest.eventId"
                    + @"WHERE guestId = @guest.guestId;"
                    + @"SELECT * FROM occasions.guests WHERE guestId = @guestId";

                var guestReturn = connection.QueryFirstAsync<Guest>(query, guest).Result;
                return guestReturn;
            }

        }

        /// <summary>
        /// Deletes a guest from the db
        /// </summary>
        /// <param name="guestId">DB id of the guest</param>
        /// <returns>Success/Failure</returns>
        public async Task<bool> DeleteById(int guestId)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    var query = @"DELETE FROM occasions.guests "
                        + @"WHERE guestId = @guestId";

                    var guestReturn = connection.QueryFirstAsync<Guest>(query, new { guestId }).Result;
                    return true;
                }
            }
            catch (Exception)
            {
                // TODO: Traditional Logging
                return false;
            }
        }
    }
}
