using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IFavoritesQuery
    {
        Task<List<Favorite>> GetAllByUserName(string userName);
        Task<Favorite> Add(Favorite favorite);
        Task<bool> Delete(Favorite favorite);
        Task<Favorite> GetFavorite(Favorite favorite);
    }
}