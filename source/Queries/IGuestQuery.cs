using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public interface IGuestQuery
    {
        Task<List<Guest>> GetGuestListByEventId(int eventId);
        Task InsertGuest(Guest guest);
        Task UpdateGuest(Guest guest);
        Task DeleteGuestById(int guestId);
    }
}
