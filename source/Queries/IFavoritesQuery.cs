using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IFavoritesQuery
    {
        Task<List<Favorite>> GetAllByUserName(string userName);
        Task<Favorite> Add(Favorite favorite);
        Task<bool> Delete(Favorite favorite);
        //Task<Favorite> GetFavorite(string userName, int vendorId);
    }
}