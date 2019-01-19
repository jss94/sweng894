using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using source.Models;
using Microsoft.AspNetCore.Mvc;

namespace source.Queries
{
    public class VendorsQuery : IVendorsQuery
    {

        public readonly IAppDatabase _database;
        public VendorsQuery(IAppDatabase db)
        {
            _database = db;
        }

        public async Task<List<Vendor>> GetAllAsync()
        {
            throw new NotImplementedException();
        }
    }
}