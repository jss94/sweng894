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

                    string query = @"SELECT id, street, city, state, zip"
                        + @" FROM occasions.addresses "
                        + @" WHERE id = @id AND active = 1;";

                    var result = connection.QueryFirstAsync<Address>(query, new { id }).Result;
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
        /// Insert the specified address.
        /// </summary>
        /// <returns>The insert.</returns>
        /// <param name="address">Address.</param>
        public async Task<int> Insert(Address address)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.addresses "
                        + @"(street, city, state, zip)"
                        + @" VALUES(@street, @city, @state, @zip); "
                        + @" SELECT id FROM occasions.addresses WHERE id = LAST_INSERT_ID() AND active = 1; ";

                    var result = connection.QueryFirstAsync<int>(query, address).Result;
                    return result;
                }
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
                return new int();
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
                        + @"SET street = @street, city = @city, state = @state, zip = @zip"
                        + @" WHERE id = @id; "
                        + @" SELECT * FROM occasions.addresses WHERE id = @id AND active = 1;";

                    var result = connection.QueryFirstAsync<Address>(query, address).Result;
                    await Task.CompletedTask;
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
        /// <param name="address">Address.</param>
        public async Task Deactivate(Address address)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"UPDATE occasions.addresses "
                        + @" SET active = 0"
                        + @" WHERE id = @id AND active = 1;";

                    var results = connection.QueryAsync<Vendor>(query, address);
                    await Task.CompletedTask;            
                }
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db
                //Errors should bubble up but this is super helpful during development
                await Task.CompletedTask;
            }
        }

    }
}