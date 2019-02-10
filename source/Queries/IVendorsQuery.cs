﻿using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IVendorsQuery
    {
        Task<List<Vendor>> GetAll();
        Task<Vendor> GetById(int id);
        Task<Vendor> GetByUserName(string userName);
        Task<Vendor> Insert(Vendor vendor);
        Task<Vendor> Update(Vendor vendor);
        Task<bool> Deactivate(int id);
        Task<bool> Delete(int id);
    }
}