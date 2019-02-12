using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public interface IGuestQuery
    {
        Task<List<Guest>> GetListByEventId(int eventId);
        Task<Guest> Insert(Guest guest);
        Task<Guest> Update(Guest guest);
        Task<bool> DeleteByGuestId(int guestId);
        Task<bool> DeleteByEventId(int eventId);
    }
}
