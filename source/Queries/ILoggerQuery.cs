using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    /// <summary>
    /// Interface for logger repository
    /// </summary>
    public interface ILoggerQuery
    {
        Task<bool> LogError(VerboseError error);
    }
}
