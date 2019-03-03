
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
        public async Task<Event> GetEventById(int eventId)
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
        public async Task CreateEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.events (userName, name, description, dateTime, guid) "
                    + @"VALUES (@userName, @name, @description, @dateTime, @guid)";

                await Task.CompletedTask;

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                await connection.ExecuteAsync(query, evnt);
               
            }
        }

        /// <summary>
        /// Get all events associated with a user
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<List<Event>> GetAllEventsByUser(string userName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.events "
                    + @"WHERE username = @userName;";

                var events = connection.QueryAsync<Event>(query, new { userName } ).Result.ToList();
                return events;
            }
        }

        /// <summary>
        /// Get all events for a GUID
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public async Task<Event> GetEventByGuid(string guid)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query =
                      @" SELECT * FROM occasions.events "
                    + @" WHERE guid = @guid;";

                return await connection.QueryFirstOrDefaultAsync<Event>(query, new { guid });
            }
        }

        /// <summary>
        /// Enables a user to update the eventName, eventDescription and eventDateTime
        /// </summary>
        /// <param name="evnt"></param>
        /// <returns></returns>
        public async Task UpdateEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.events"
                    + " SET name=@name, description=@description, dateTime=STR_TO_DATE(@dateTime,'%Y-%m-%d %h:%i:%s')"
                    + " WHERE eventId =  @eventId";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, new { evnt.name, evnt.description, evnt.dateTime, evnt.eventId});

            }
        }

        /// <summary>
        /// Deletes the by identifier.
        /// </summary>
        /// <returns></returns>
        /// <param name="id">Identifier.</param>
        public async Task DeleteById(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.events WHERE eventId = @id";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, new { id } );
            }
        }

        /// <summary>
        /// Deletes the name of the by user.
        /// </summary>
        /// <returns></returns>
        /// <param name="userName">Identifier.</param>
        public async Task DeleteByUserName(string userName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.events WHERE userName = @userName";

                await Task.CompletedTask;

                await connection.ExecuteAsync(query, new { userName });
            }
        }
    }
}