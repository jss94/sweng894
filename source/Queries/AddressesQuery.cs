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
    /// Addresses query.
    /// </summary>
    public class AddressesQuery : IAddressesQuery
    {
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:source.Queries.AddressesQuery"/> class.
        /// </summary>
        /// <param name="db">Db.</param>
        public AddressesQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Gets all async.
        /// </summary>
        /// <returns>The all async.</returns>
        public async Task<List<Address>> GetAll()
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT id, street, city, state, zip"
                        + @" FROM occasions.addresses "
                        + @" WHERE active = 1;";

                    var result = connection.QueryAsync<Address>(query).Result.ToList();
                    return result;
                }
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
                return new List<Address>();
            }
        }

        /// <summary>
        /// Gets the by identifier.
        /// </summary>
        /// <returns>The by identifier.</returns>
        /// <param name="id">Identifier.</param>
        public async Task<Address> GetById(int id)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"SELECT userName, id, street, city, state, zip"
                        + @" FROM occasions.addresses "
                        + @" WHERE id = @id AND active = 1;";

                    var result = connection.QueryFirstOrDefaultAsync<Address>(query, new { id }).Result;
                    return result;
                }
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
                return new Address();
            }
        }


        /// <summary>
        /// Gets the name of the by user.
        /// </summary>
        /// <returns>The by user name.</returns>
        /// <param name="userName">User name.</param>
        public async Task<Address> GetByUserName(string userName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT userName, id, street, city, state, zip"
                    + @" FROM occasions.addresses "
                    + @" WHERE userName = @userName AND active = 1;";

                var result = await connection.QueryFirstOrDefaultAsync<Address>(query, new { userName });
                return result;
            }
        }

        /// <summary>
        /// Insert the specified address.
        /// </summary>
        /// <returns>The insert.</returns>
        /// <param name="address">Address.</param>
        public async Task Insert(Address address)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.addresses "
                        + @"(userName, street, city, state, zip)"
                        + @" VALUES(@userName, @street, @city, @state, @zip); ";

                    await connection.ExecuteAsync(query, address);
                }
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
                await Task.CompletedTask;
            }
        }

        /// <summary>
        /// Update the specified address.
        /// </summary>
        /// <returns>The update.</returns>
        /// <param name="address">Address.</param>
        public async Task Update(Address address)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.addresses "
                        + @" SET street = @street, city = @city, state = @state, zip = @zip"
                        + @" WHERE userName = @userName; ";

                    await connection.ExecuteAsync(query, address);
                }
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
                await Task.CompletedTask;
            }
        }

        /// <summary>
        /// Deactivate the specified address.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="userName">User name</param>
        public async Task Deactivate(string userName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.addresses "
                    + @" SET active = 0"
                    + @" WHERE userName = @userName AND active = 1;";

                var results = connection.QueryAsync<Vendor>(query, new { userName });
                await Task.CompletedTask;            
            }
        }

        /// <summary>
        /// Reactivate the specified userName.
        /// </summary>
        /// <returns>The reactivate.</returns>
        /// <param name="userName">User name.</param>
        public async Task Reactivate(string userName)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.addresses "
                    + @" SET active = 1"
                    + @" WHERE userName = @userName AND active = 0;";

                var results = connection.QueryAsync<Vendor>(query, new { userName });
                await Task.CompletedTask;
            }
        }

    }
}