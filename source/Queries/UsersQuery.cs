using System;
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
    /// Users query.
    /// </summary>
    public class UsersQuery : IUsersQuery
    {

        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase supplied via dependency injection</param>
        public UsersQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Gets a single user by username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<User> GetByUserName(string username)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string userQuery = @"SELECT userName, name, addressId, role "
                        + @"FROM occasions.users WHERE userName = @username;";

                    var user = connection.QueryFirstAsync<User>(userQuery, new { username }).Result;

                    return user;
                }
            }
            catch (Exception)
            {
                return new User();
            }

        }

        /// <summary>
        /// Gets all users
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetAll()
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT userName, name, addressId, role "
                        + @"FROM occasions.users "
                        + @"WHERE active = 1 ORDER BY userName DESC;";

                    var users = connection.QueryAsync<User>(query).Result.ToList();
                    return users;
                }
            }
            catch (Exception)
            {
                return new List<User>();
            }

        }

        /// <summary>
        /// Insert the specified user.
        /// </summary>
        /// <returns>The insert.</returns>
        /// <param name="user">User.</param>
        public async Task<int> Insert(User user)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.users (userName, name, addressId, role) "
                        + @"VALUES (@userName, @name, @addressId, @role);"
                        + @"SELECT LAST_INSERT_ID() FROM occasions.users WHERE active = 1;";

                    var result = connection.QueryFirstAsync<int>(query, user).Result;
                    return result;
                }
            } 
            catch(Exception)
            {
                return new int();
            }

        }

        /// <summary>
        /// Updates an existing users record
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task Update(User user)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.users"
                        + @" SET username = @username, name = @name, addressId = @addressId, role = @role "
                        + @" WHERE username = @username;"
                        + @" SELECT * FROM occasions.users WHERE id = @id AND active = 1;";

                    var updatedUser = connection.QueryFirstAsync<User>(query, user).Result;
                    await Task.CompletedTask;
                }
            }
            catch (Exception)
            {
                await Task.CompletedTask;
            }

        }

        /// <summary>
        /// Deactivate the specified user.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="user">User.</param>
        public async Task Deactivate(User user)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.users "
                        + @"SET active = 0 WHERE username = @username;";

                    var result = connection.QueryFirstAsync<Vendor>(query, user).Result;
                    await Task.CompletedTask;
                }
            }
            catch (Exception)
            {
                await Task.CompletedTask;
            }
        }

    }
}