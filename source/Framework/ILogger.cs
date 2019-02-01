﻿using source.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Framework
{
    /// <summary>
    /// Interface for Logger
    /// </summary>
    public interface ILogger
    {
        Task LogEvent(string userName, string logValue, string logDetail);
    }
}
