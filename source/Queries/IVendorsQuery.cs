using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using Microsoft.AspNetCore.Mvc;

namespace source.Queries
{
    public interface IVendorsQuery
    {
        Task<List<Vendor>> GetAllAsync();
        Task<Vendor> GetById(int id);
        Task<Vendor> GetByUserName(string userName);
    }
}