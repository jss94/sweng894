using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IVendorEventsQuery
    {
        Task<List<VendorEvent>> GetVendorEvents(int vendorId);

    }
}