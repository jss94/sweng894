using Dapper;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    /// <summary>
    /// Logger Repository
    /// </summary>
    public class LoggerQuery: ILoggerQuery
    {
        /// <summary>
        /// Database
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">Database supplied via dependency injection</param>
        public LoggerQuery(IAppDatabase db)
        {
            _database = db;
        }
        
        public async Task<bool> LogError(VerboseError error)
        {
            try
            {
                using (var db = _database)
                {
                    var connection = db.Connection as MySqlConnection;
                    await connection.OpenAsync();

                    string query = @"INSERT INTO occasions.errors "
                            + @"(source, errorMessage, innerException, stackTrace, date) "
                            + @"VALUES(@source, @errorMessage, @innerException, @stackTrace, @date); "
                            + @"SELECT * FROM occasions.errors WHERE id = LAST_INSERT_ID();";

                    var result = connection.QueryFirstAsync<int>(query, error).Result;
                    if (result > 0)
                        return true;
                    return false;
                }
            }
            catch(Exception)
            {
                return false;
            }
        }
    }
}
