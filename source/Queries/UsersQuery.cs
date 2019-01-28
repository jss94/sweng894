using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Dapper;
using System.Linq;

namespace source.Queries
{
    /// <summary>
    /// Users repository
    /// </summary>
    public class UsersQuery : IUsersQuery
    {
        /// <summary>
        /// database object
        /// </summary>
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
        public async Task<User> GetOneAsync(string username)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT userName, firstName, lastName, addressId, role "
                    + @"FROM occasions.users WHERE userName = @userName;";

                var user = connection.QueryFirstAsync<User>(query, new { username }).Result;
                return user;
            }
        }

        /// <summary>
        /// Gets all users
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetAllAsync()
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT userName, firstName, lastName, addressId, role "
                    + @"FROM occasions.users "
                    + @"WHERE active = 1 ORDER BY userName DESC;";

                var users = connection.QueryAsync<User>(query).Result.ToList();
                return users;
            }
        }

        /// <summary>
        /// Inserts a user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<User> InsertAsync(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"INSERT INTO occasions.users (userName, firstName, lastName, addressId, role) "
                    + @"VALUES (@userName, @firstName, @lastName, @addressId, @role);"
                    + @"SELECT * FROM occasions.users WHERE id = LAST_INSERT_ID() AND active = 1;";

                var newUser = connection.QueryFirstAsync<User>(query, user).Result;
                return newUser;
            }
        }

        /// <summary>
        /// Updates an existing users record
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<User> UpdateAsync(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.users SET username = @username, "
                    + @"firstName = @firstname, lastName = @lastName "
                    + @"addressId = @addressId, role = @role "
                    + @"WHERE username = @username;"
                    + @"SELECT * FROM occasions.users WHERE id = @id AND active = 1;";

                var updatedUser = connection.QueryFirstAsync<User>(query, user).Result;
                return updatedUser;
            }
        }

        /// <summary>
        /// Deactivates a user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task DeactivateAsync(User user)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.users "
                    + @"SET active = 0 WHERE username = @username;";

                var result = connection.QueryFirstAsync<Vendor>(query, user).Result;
            }
        }

    }
}