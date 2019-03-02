using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public interface IGuestQuery
    {
        Task<Guest> GetByGuestId(int id);
        Task<List<Guest>> GetListByEventId(int eventId);
        Task<List<Guest>> GetListByEventGuid(string guid);
        Task Insert(Guest guest);
        Task Update(Guest guest);
        Task DeleteByGuestId(int guestId);
        Task DeleteByEventId(int eventId);
    }
}
