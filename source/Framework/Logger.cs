using source.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Framework
{
    /// <summary>
    /// Logger class for logging to database
    /// </summary>
    public class Logger: ILogger
    {
        private ILoggerQuery _loggerQuery;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="loggerQuery">Logger query supplied by dependency injection</param>
        public Logger(ILoggerQuery loggerQuery)
        {
            _loggerQuery = loggerQuery;
        }
        
        public async Task LogEvent(string userName, string logValue, string logDetail)
        {
            
            

        }
    }
}
