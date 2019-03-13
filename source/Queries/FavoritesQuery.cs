using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using source.Database;
using source.Models;
using Dapper;
using MySql.Data.MySqlClient;
using System.Data;

namespace source.Queries
{
    public class FavoritesQuery : IFavoritesQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase via dependency injection</param>
        public FavoritesQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Adds a new favorite vendor record
        /// </summary>
        /// <param name="favorite">Vendor id</param>
        /// <returns>The added favorite if successful; null otherwise</returns>
        public async Task<Favorite> Add(Favorite favorite)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.favorites (userName, vendorId) "
                        + @"VALUES (@userName, @vendorId)";

                    var affectedRows = await connection.ExecuteAsync(query, favorite);

                    if (affectedRows == 0)
                    {
                        return null;
                    }
                    else
                    {
                         var newFavorite = await GetFavorite(favorite);
                         return newFavorite;
                    }                    
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Delete a favorite vendor.
        /// </summary>
        /// <returns>True when the favorite was successfully deleted; False otherwise</returns>
        /// <param name="favorite">The favorite to delete</param>
        public async Task<bool> Delete(Favorite favorite)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"DELETE FROM occasions.favorites WHERE userName = @userName AND vendorID = @vendorId";

                    await Task.CompletedTask;

                    var affectedRows = await connection.ExecuteAsync(query, favorite);

                    return affectedRows != 0 ? true : false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            //throw new NotImplementedException();
        }

        /// <summary>
        /// Gets a list of favorite veddor records for a particular user
        /// </summary>
        /// <param name="userName">User's username</param>
        /// <returns>List of favorite vendor records</returns>
        public async Task<List<Favorite>> GetAllByUserName(string userName)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();
                    string query =
                        @"SELECT * from occasions.favorites WHERE userName = @userName;";

                    var favorites = connection.QueryAsync<Favorite>(query, new { userName }).Result.ToList();
                    return favorites;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Gets a single favorite vendor record
        /// </summary>
        /// <param name="fav">The favorite to retrieve</param>
        /// <returns>A favorite vendor record or null if one doesn't exist</returns>
        public async Task<Favorite> GetFavorite(Favorite fav)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }
                    
                    string query =
                          @"SELECT * from occasions.favorites WHERE userName = @userName AND vendorId = @vendorId;";

                    var result = connection.QueryAsync<Favorite>(query, new { fav.userName, fav.vendorId }).Result.ToList(); 

                    var favorite = result.FirstOrDefault();

                    return favorite;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
