using source.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Queries
{
    public interface IVendorServicesQuery
    {
        Task<List<Vendor>> GetVendorsByServiceTypes(string serviceType);
        Task<List<VendorServices>> GetAll();
        Task<VendorServices> InsertService(VendorServices service);
        Task<VendorServices> UpdateService(VendorServices service);
        Task<List<VendorServices>> GetServicesByVendor(int id);
        Task<bool> Deactivate(int id);
        Task<bool> Reactivate(int id);
    }
}
