using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Security;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;

namespace source.Queries
{
    public class EventOrganizerQuery
    {
        public readonly IAppDatabase _database;
        public EventOrganizerQuery(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<EventOrganizer> GetEventOrganizerById(int id)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT id, firstName, lastName, displayName, emailAddress, password, phoneNumber  FROM sweng894.eventOrganizers WHERE id = @id;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@id",
                    DbType = DbType.Int64,
                    Value = id,
                });
                var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
                return result.Count > 0 ? result[0] : null;
            }
        }

        public async Task<EventOrganizer> GetEventOrganizerByEmail(string emailAddress)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT id, firstName, lastName, displayName, emailAddress, password, phoneNumber  FROM sweng894.eventOrganizers WHERE id = @emailAddress;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@emailAddress",
                    DbType = DbType.Int64,
                    Value = emailAddress,
                });
                var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
                return result.Count > 0 ? result[0] : null;
            }
        }

        private async Task<List<EventOrganizer>> ReadAllAsync(DbDataReader reader)
        {
            var posts = new List<EventOrganizer>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new EventOrganizer()
                    {
                        id = await reader.GetFieldValueAsync<int>(0),
                        firstName = await reader.GetFieldValueAsync<string>(1),
                        lastName = await reader.GetFieldValueAsync<string>(2),
                        displayName = await reader.GetFieldValueAsync<string>(3),
                        emailAddress = await reader.GetFieldValueAsync<string>(4),
                        password = await reader.GetFieldValueAsync<SecureString>(5),
                        phoneNumber = await reader.GetFieldValueAsync<string>(6)
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }
    }
}
