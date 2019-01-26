using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;

namespace source.Queries
{
    public class EventDao
    {

        public readonly IAppDatabase _database;

        public EventDao()
        {
            //empty constructor
        }

        public EventDao(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<Event> GetOneEventById(string eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT * FROM sweng894.events WHERE event_Id = @eventId;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@eventId",
                    DbType = DbType.String,
                    Value = eventId,
                });
                var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
                return result.Count > 0 ? result[0] : null;
            }
        }

        public async Task<Event> CreateNewEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"INSERT INTO SWENG894.EVENTS (ORGANIZER_USERNAME, EVENT_NAME, EVENT_DESCRIPTION) VALUES (@organizerUserName, @eventName, @eventDesc)";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@organizerUserName",
                    DbType = DbType.String,
                    Value = evnt.organizerId,
                });
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@eventName",
                    DbType = DbType.String,
                    Value = evnt.organizerId,
                });
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@eventDesc",
                    DbType = DbType.String,
                    Value = evnt.organizerId,
                });
                var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
                return result.Count > 0 ? result[0] : null;
            }
        }

        public async Task<List<Event>> GetAllEventsByUser(string organizerUserName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT * FROM sweng894.events WHERE organizer_username = @organizerId;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@organizerId",
                    DbType = DbType.String,
                    Value = organizerUserName,
                });
                return await ReadAllAsync(await cmd.ExecuteReaderAsync());
            }
        }

        private async Task<List<Event>> ReadAllAsync(DbDataReader reader)
        {
            var posts = new List<Event>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new Event()
                    {
                        name = await reader.GetFieldValueAsync<string>(0),
                        description = await reader.GetFieldValueAsync<string>(1),
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }
    }
}