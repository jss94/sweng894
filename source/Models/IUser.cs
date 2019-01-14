using System.Threading.Tasks;
using source.Database;

namespace source.Models
{
    public interface IUser
    {
        string id { get; set; }
        string name { get; set; }
        string role { get; set; }
        IAppDatabase _database { get; set; }

        Task DeleteAsync();
        Task InsertAsync();
        Task UpdateAsync();
    }
}