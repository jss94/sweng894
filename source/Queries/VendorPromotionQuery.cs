
using Dapper;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    /// <summary>
    /// Retrives Vendor Promotion from the Database
    /// </summary>
    public class VendorPromotionQuery : IVendorPromotionQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase supplied by dependency injection</param>
        public VendorPromotionQuery(IAppDatabase db)
        {
            _database = db;
        }
        
        public async Task<List<Promotion>> GetPromotions(int vendorId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.promotions "
                    + @"WHERE vendorId = @vendorId;";

                var promotions = connection.QueryAsync<Promotion>(query, new { vendorId }).Result.ToList();
                return promotions;
            }
        }

        public async Task CreatePromotion(Promotion promotion)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.promotions (vendorId, startDate, endDate, description) "
                    + @"VALUES (@vendorId, @startDate, @endDate, @description)";

                await Task.CompletedTask;

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                await connection.ExecuteAsync(query, promotion);

            }
        }

        public async Task DeletePromotion(int promotionId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.promotions WHERE promotionId = @promotionId";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, new { promotionId });
            }
        }

        public async Task<Promotion> GetPromotion(int promotionId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.promotions "
                    + @"WHERE promotionId = @promotionId;";

                var promotion = await connection.QueryFirstAsync<Promotion>(query, new { promotionId });
                return promotion;
            }
        }
    }
}