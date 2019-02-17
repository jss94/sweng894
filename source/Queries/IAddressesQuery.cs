using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IAddressesQuery
    {
        Task Deactivate(string userName);
        Task Reactivate(string userName);
        Task<List<Address>> GetAll();
        Task<Address> GetByUserName(string userName);
        Task<Address> GetById(int id);
        Task Insert(Address address);
        Task Update(Address address);
    }
}