using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    /// <summary>
    /// Reservations query interface
    /// </summary>
    public interface IReservationsQuery
    {
        Task<List<Reservation>> GetAll();
        Task<Reservation> Insert(Reservation reservation);
        Task<Reservation> Update(Reservation reservation);
        Task<List<Reservation>> GetByVendor(int vendorId);
        Task<List<Reservation>> GetByUserName(string userName);
    }
}
