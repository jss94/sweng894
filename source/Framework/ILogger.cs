using System;
using System.Threading.Tasks;

namespace source.Framework
{
    /// <summary>
    /// Interface for Logger
    /// </summary>
    public interface ILogger
    {
        Task LogUnhandledException(System.Security.Claims.ClaimsPrincipal user, Exception error);
        Task LogUnhandledException(Exception error);
        Task LogError(System.Security.Claims.ClaimsPrincipal user, Exception ex);
    }
}
