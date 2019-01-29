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
        Task<Guest> InsertGuest(Guest guest);
        Task<Guest> UpdateGuest(Guest guest);
        Task<bool> DeleteGuestById(int guestId);
    }
}
