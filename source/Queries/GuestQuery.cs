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
using source.Framework;

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
        private readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">DB used to pull guests</param>
        public GuestQuery(IAppDatabase db)
        {
            _database = db;
        }


        /// <summary>
        /// Get by guest ID
        /// </summary>
        /// <param name="guestId">DB id of the guest you want to search for</param>
        /// <returns>List of guests</returns>
        public async Task<Guest> GetByGuestId(int guestId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.guests WHERE guestId = @guestId";

                var guest = await connection.QueryFirstOrDefaultAsync<Guest>(query, new { guestId });
                return guest;
            }
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
        /// Get a list of guests by event
        /// </summary>
        /// <param name="guid">Guid of the event you want</param>
        /// <returns>List of guests</returns>
        public async Task<List<Guest>> GetListByEventGuid(string guid)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();
                
                string query = @"SELECT * FROM occasions.guests WHERE eventGuid = @guid";

                var guests = await connection.QueryAsync<Guest>(query, new { guid });
                return guests.ToList();
            }
        }

        /// <summary>
        /// Add a guest to the DB
        /// </summary>
        /// <param name="guest">Person being added</param>
        /// <returns>The guest back after successful addition</returns>
        public async Task Insert(Guest guest)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"INSERT INTO occasions.guests (name, email, isGoing, eventGuid) "
                    + @"VALUES (@name, @email, @isGoing, @eventGuid)";

                await Task.CompletedTask;

                await connection.ExecuteAsync(query, guest);

            }

        }

        /// <summary>
        /// Update a guest information
        /// </summary>
        /// <param name="guest">guest information going to be updated</param>
        /// <returns></returns>
        public async Task Update(Guest guest)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();
                
                string query = @"UPDATE occasions.guests SET "
                    + "name = @name, "
                    + "email = @email, "
                    + "isGoing = @isGoing "
                    + "WHERE guestId = @guestId;";

                await connection.ExecuteAsync(query, guest);
            }
        }

        /// <summary>
        /// Deletes a guest from the db
        /// </summary>
        /// <param name="guestId">DB id of the guest</param>
        /// <returns>Success/Failure</returns>
        public async Task DeleteByGuestId(int guestId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var query = @"DELETE FROM occasions.guests "
                    + @"WHERE guestId = @guestId";
                    
                await connection.ExecuteAsync(query, new { guestId });
            }
        }

        /// <summary>
        /// Deletes event by event identifier.
        /// </summary>
        /// <returns>The by event identifier.</returns>
        /// <param name="eventId">Event identifier.</param>
        public async Task DeleteByEventId(int eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var query = @"DELETE FROM occasions.guests "
                    + @"WHERE eventId = @eventId";

                await Task.CompletedTask;

                await connection.ExecuteAsync(query, new { eventId });

            }
        }
    }
}
