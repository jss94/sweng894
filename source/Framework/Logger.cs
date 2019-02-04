using source.Models;
using source.Queries;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace source.Framework
{
    /// <summary>
    /// Logger class for logging to database
    /// </summary>
    public class Logger : ILogger
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

        /// <summary>
        /// Logs unhandled exceptions when user context is available
        /// </summary>
        /// <param name="user"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        public async Task LogUnhandledException(System.Security.Claims.ClaimsPrincipal user, Exception ex)
        {
            VerboseError error = await GetError(user, ex);
            error.source += " - Unhandled Exception";
            await _loggerQuery.LogError(error);
        }

        /// <summary>
        /// Logs unhandled exceptions when user context is not available
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public async Task LogUnhandledException(Exception ex)
        {
            VerboseError error = await GetError(ex);
            await _loggerQuery.LogError(error);
        }

        /// <summary>
        /// Logs handled errors
        /// </summary>
        /// <param name="user"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        public async Task LogError(System.Security.Claims.ClaimsPrincipal user, Exception ex)
        {
            VerboseError error = await GetError(user, ex);
            await _loggerQuery.LogError(error);
        }

        private async Task<VerboseError> GetError(System.Security.Claims.ClaimsPrincipal user, Exception ex)
        {
            VerboseError error = new VerboseError
            {
                source = await ExtractUserName(user),
                errorMessage = ex.Message,
                innerException = ex.InnerException != null ? ex.InnerException.ToString() : String.Empty,
                stackTrace = ex.StackTrace,
                date = DateTime.Now
            };
            return error;
        }

        private async Task<VerboseError> GetError(Exception ex)
        {
            VerboseError error = new VerboseError
            {
                source = "Unhandled Exception",
                errorMessage = ex.Message,
                innerException = ex.InnerException != null ? ex.InnerException.ToString() : String.Empty,
                stackTrace = ex.StackTrace,
                date = DateTime.Now
            };
            return error;
        }

        private async Task<string> ExtractUserName(System.Security.Claims.ClaimsPrincipal user)
        {
            if (user.Claims.Count() > 0)
            {
                var userNameClaim = user.Claims.FirstOrDefault(c => c.Type == "http://localhost:5001/user_email");
                return userNameClaim.Value;
            }
            return "User not available";
        }
    }
}
