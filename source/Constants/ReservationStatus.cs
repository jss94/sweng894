using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Constants
{
    public class ReservationStatus
    {
        private List<string> ReservationStatuses = new List<string>
        { "New", "Changed", "Accepted" };

            public List<string> GetReservationStatuses()
            {
                return ReservationStatuses;
            }
        }
    
}
