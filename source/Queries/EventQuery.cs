using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;

namespace source.Queries
{
    public class EventQuery : IEventQuery
    {

        public readonly IAppDatabase _database;

        public EventQuery()
        {
            //empty constructor
        }

        public EventQuery(IAppDatabase db)
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
                cmd.CommandText = @"SELECT * FROM occasions.events WHERE eventId = @eventId;";
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

        public async Task<int> CreateNewEvent(Event evnt)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"INSERT INTO occasions.events (ORGANIZERUSERNAME, EVENTNAME, EVENTDESCRIPTION) VALUES (@organizerUserName, @eventName, @eventDesc)";
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
                    Value = evnt.name,
                });
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@eventDesc",
                    DbType = DbType.String,
                    Value = evnt.description,
                });
                var result = await cmd.ExecuteNonQueryAsync();
                Console.WriteLine(">>>>" + result);
                return result;
            }
        }

        public async Task<List<Event>> GetAllEventsByUser(string organizerUserName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT eventName, eventDescription FROM occasions.events WHERE organizerUsername = @organizerId;";
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
        

        public Task UpdateEvent(Event evnt)
        {
            throw new NotImplementedException();
        }
    }
}