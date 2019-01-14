using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IUsersQuery
    {
        Task<List<User>> GetAllAsync();
        Task<User> GetOneAsync(string userId);
    }
}