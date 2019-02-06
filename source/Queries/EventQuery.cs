
using System.Collections.Generic;
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
        /// <returns>Event</returns>
        public async Task<Event> CreateEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.events (userName, name, description, dateTime) "
                    + @"VALUES (@userName, @name, @description, @dateTime)";

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                Event createdEvent = connection.QueryAsync<Event>(query, evnt).Result.ToList().FirstOrDefault();


                return createdEvent;
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
        /// Enables a user to update the eventName, eventDescription and eventDateTime
        /// </summary>
        /// <param name="evnt"></param>
        /// <returns></returns>
        public async Task<Event> UpdateEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();
                
                string query = @"UPDATE occasions.events"
                    + " SET name=@name, description=@description, dateTime=STR_TO_DATE(@dateTime,'%m/%d/%Y %h:%i:%s %p')"
                    + " WHERE eventId =  @eventId";

                return connection.QueryAsync<Event>(query, new { evnt.name, evnt.description, evnt.dateTime, evnt.eventId}).Result.ToList().FirstOrDefault();
            }
        }

        public async Task<bool> DeleteEvent(Event evnt)
        {
            using (var db = _database)
            {
             //   try
               // {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                
                    string query = @"DELETE FROM occasions.events"
                        + " WHERE eventId =  @eventId";
                //    connection.Execute(query, new { evnt.eventId}, commandType: CommandType.Text);

                await connection.QueryAsync<Event>(query, new { evnt.eventId } );

                    return true;
               // }
               // catch (Exception ex)
               // {
                 //   Console.WriteLine(ex.StackTrace);

                    //TODO: we should log our errors in the db
                    //Errors should bubble up but this is super helpful during development
                   // return false;
              //  }

            }
        }
    }
}