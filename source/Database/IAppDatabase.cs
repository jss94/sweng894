using System;
using System.Data;

namespace source.Database
{
    public interface IAppDatabase : IDisposable
    {
        IDbConnection Connection { get; set; }
    }
}