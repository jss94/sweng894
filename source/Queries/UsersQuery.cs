using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;

namespace source.Queries
{
    public class UsersQuery : IUsersQuery
    {

        public readonly IAppDatabase _database;
        public UsersQuery(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<User> GetOneAsync(string userId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT id, name, role FROM sweng894.users WHERE id = @userId;";
                cmd.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@userId",
                    DbType = DbType.String,
                    Value = userId,
                });
                var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
                return result.Count > 0 ? result[0] : null;
            }
        }

        public async Task<List<User>> GetAllAsync()
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"SELECT id, name, role FROM sweng894.users ORDER BY id DESC;";
                return await ReadAllAsync(await cmd.ExecuteReaderAsync());
            }
        }

        private async Task<List<User>> ReadAllAsync(DbDataReader reader)
        {
            var posts = new List<User>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new User()
                    {
                        id = await reader.GetFieldValueAsync<string>(0),
                        name = await reader.GetFieldValueAsync<string>(1),
                        role = await reader.GetFieldValueAsync<string>(2)
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }
    }
}