using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IAddressesQuery
    {
        Task<bool> Deactivate(Address address);
        Task<List<Address>> GetAllAsync();
        Task<Address> GetById(int id);
        Task<Address> Insert(Address address);
        Task<Address> Update(Address address);
    }
}