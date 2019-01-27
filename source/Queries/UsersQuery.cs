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
    public class UsersQuery : IUsersQuery
    {

        public readonly IAppDatabase _database;
        public UsersQuery(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<User> GetOneAsync(string username)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText
                    = @"SELECT userName, firstName, lastName, addressId, role "
                    + @"FROM occasions.users WHERE userName = @userName;";
                BindId(cmd, username);
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
                cmd.CommandText
                    = @"SELECT userName, firstName, lastName, addressId, role "
                    + @"FROM occasions.users "
                    + @"WHERE active = 1 ORDER BY userName DESC;";
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
                        userName = await reader.GetFieldValueAsync<string>(0),
                        firstName = await reader.GetFieldValueAsync<string>(1),
                        lastName = await reader.GetFieldValueAsync<string>(2),
                        addressId = await reader.GetFieldValueAsync<string>(3),
                        role = await reader.GetFieldValueAsync<string>(4),
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }


        public async Task InsertAsync(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText 
                    = @"INSERT INTO occasions.users (userName, firstName, lastName, addressId, role) "
                    + @"VALUES (@user.userName, @user.firstName, @user.lastName, @user.addressId, @user.role);";
                BindParams(cmd, user);
                await cmd.ExecuteNonQueryAsync();
            }

        }

        public async Task UpdateAsync(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText
                    = @"UPDATE occasions.users SET userName = @user.userName, "
                    + @"firstName = @user.firstName, lastName = @user.lastName "
                    + @"addressId = @user.addressId, role = @user.role "
                    + @"WHERE userName = @user.userName;";
                BindParams(cmd, user);
                BindId(cmd, user);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task DeactivateAsync(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                var cmd = db.Connection.CreateCommand() as MySqlCommand;
                cmd.CommandText 
                    = @"UPDATE occasions.users "
                    + @"SET Active = 0 WHERE userName = @user.userName;";
                BindId(cmd, user);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        private void BindId(MySqlCommand cmd, string userName)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@userName",
                DbType = DbType.String,
                Value = userName,
            });
        }

        private void BindId(MySqlCommand cmd, User user)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@userName",
                DbType = DbType.String,
                Value = user.userName,
            });
        }

        private void BindParams(MySqlCommand cmd, User user)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@firstName",
                DbType = DbType.String,
                Value = user.firstName,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@lastName",
                DbType = DbType.String,
                Value = user.lastName,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@addressId",
                DbType = DbType.String,
                Value = user.addressId,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@role",
                DbType = DbType.String,
                Value = user.role,
            });
        }
    }
}