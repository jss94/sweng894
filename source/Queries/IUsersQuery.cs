
using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IUsersQuery
    {
        Task<List<User>> GetAll();
        Task<User> GetByUserName(string userName, bool isActive = true);
        Task Deactivate(User user);
        Task Reactivate(User user);
        Task Insert(User user);
        Task Update(User user);
        Task Delete(User user);
    }
}