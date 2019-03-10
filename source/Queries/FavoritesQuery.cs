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

        public FavoritesQuery(IAppDatabase db)
        {
            _database = db;
        }

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

                    //await Task.CompletedTask;

                    var affectedRows = await connection.ExecuteAsync(query, favorite);

                    if (affectedRows == 0)
                    {
                        return null;
                    }
                    else
                    {
                        var newFavorite = await GetFavorite(favorite.userName, favorite.vendorId);
                        return newFavorite;
                    }                    
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

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

            //throw new NotImplementedException();
        }

        protected async Task<Favorite> GetFavorite(string userName, int vendorId)
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

                    var result = connection.QueryAsync<Favorite>(query, new { userName, vendorId }).Result.ToList();

                    var favorite = result.FirstOrDefault();

                    return favorite;
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            //throw new NotImplementedException();
        }
    }
}
