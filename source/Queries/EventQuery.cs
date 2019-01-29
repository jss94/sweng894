using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;

namespace source.Queries
{
    /// <summary>
    /// Event repository
    /// </summary>
    public class EventQuery : IEventQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase supplied by dependency injection</param>
        public EventQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Get an event by id
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns></returns>
        public async Task<Event> GetOneEventById(int eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.events WHERE eventId = @eventId;";

                // Use the structure new { object } when you are passing in a single param
                // If you pass in the object without the new { } Dapper will look for the 
                // field eventId in the object eventId (ie. eventId.eventId)
                var result = await connection.QueryFirstAsync<Event>(query, new { eventId });
                return result;
            }
        }

        /// <summary>
        /// Inserts a new event
        /// </summary>
        /// <param name="evnt"></param>
        /// <returns></returns>
        public async Task<int> CreateNewEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.events (ORGANIZERUSERNAME, EVENTNAME, EVENTDESCRIPTION, eventDateTime) "
                    + @"VALUES (@organizerUserName, @eventName, @eventDescription, @eventDateTime)";

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                int result = connection.QueryAsync<int>(query, evnt).Result.ToList().FirstOrDefault();

                return result;
            }
        }

        /// <summary>
        /// Get all events associated with a user
        /// </summary>
        /// <param name="organizerUserName"></param>
        /// <returns></returns>
        public async Task<List<Event>> GetAllEventsByUser(string organizerUserName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT eventName, eventDescription FROM occasions.events "
                    + @"WHERE organizerUsername = @organizerUserName;";

                var events = connection.QueryAsync<Event>(query, new { organizerUserName } ).Result.ToList();
                return events;
            }
        }

        /// <summary>
        /// Updates existing event
        /// </summary>
        /// <param name="evnt"></param>
        /// <returns></returns>
        public Task UpdateEvent(Event evnt)
        {
            throw new NotImplementedException();
        }
    }
}