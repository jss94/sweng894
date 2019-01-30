using source.Database;
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
    }
}
