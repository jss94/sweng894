using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IVendorsQuery
    {
        Task<List<Vendor>> GetAllAsync();
        Task<Vendor> GetById(int id);
        Task<Vendor> GetByUserName(string userName);
        Task<Vendor> InsertVendor(Vendor vendor);
        Task<Vendor> UpdateVendor(Vendor vendor);
        Task<bool> DeactivateVendor(Vendor vendor);
    }
}