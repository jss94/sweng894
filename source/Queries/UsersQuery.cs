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
        /// Gets the name of the by user.
        /// </summary>
        /// <returns>The by user name.</returns>
        /// <param name="username">Username.</param>
        /// <param name="isActive">If set to <c>true</c> is active.</param>
        public async Task<User> GetByUserName(string username, bool isActive = true)
        {
            var active = 0;
            if (isActive) active = 1;

            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string userQuery = @"SELECT userName, name, addressId, role "
                    + @"FROM occasions.users WHERE userName = @username and active = @active;";

                var user = await connection.QueryFirstOrDefaultAsync<User>(userQuery, new { username, active});

                return user;
            }
        }

        /// <summary>
        /// Gets all users
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetAll()
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

        /// <summary>
        /// Insert the specified user.
        /// </summary>
        /// <returns>The insert.</returns>
        /// <param name="user">User.</param>
        public async Task Insert(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"INSERT INTO occasions.users (userName, name, role) "
                    + @"VALUES (@userName, @name, @role);";

                await connection.ExecuteAsync(query, user);
            }
        }

        /// <summary>
        /// Updates an existing users record
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task Update(User user)
        {

            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.users"
                    + @" SET username = @username, name = @name, role = @role "
                    + @" WHERE username = @username;";

                await connection.ExecuteAsync(query, user);
            }

        }

        /// <summary>
        /// Deactivate the specified user.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="user">User.</param>
        public async Task Deactivate(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.users "
                    + @"SET active = 0 WHERE username = @username;";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, user);
            }
        }

        /// <summary>
        /// Reactivate the specified user.
        /// </summary>
        /// <returns>The reactivate.</returns>
        /// <param name="user">User.</param>
        public async Task Reactivate(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.users "
                    + @"SET active = 1 WHERE username = @username;";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, user);

            }
        }


        /// <summary>
        /// Delete the specified user.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="user">User.</param>
        public async Task Delete(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.users "
                    + @"WHERE active = 1 AND username = @username;";

                await connection.ExecuteAsync(query, user);
                await Task.CompletedTask;
            }
        }
    }
}