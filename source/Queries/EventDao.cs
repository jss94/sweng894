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
        public EventDao(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<Event> GetOneAsync(string eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT name, description FROM sweng894.events WHERE eventId = @eventId;";
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

        public async Task<List<Event>> GetAllAsync(string organizerId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT name, description FROM sweng894.events WHERE organizerId = @organizerId;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@organizerId",
                    DbType = DbType.String,
                    Value = organizerId,
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