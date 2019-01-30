
using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IAddressesQueryd
    {
        Task<List<Address>> GetAll();
        Task<Address> GetById(int id);
        Task<int> Insert(Vendor vendor);
        Task Update(Vendor vendor);
        Task<bool> Deactivate(Vendor vendor);
    }
}