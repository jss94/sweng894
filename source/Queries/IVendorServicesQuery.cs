using source.Models;
using System.Collections.Generic;
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
        Task<bool> DeactivateByServiceId(int id);
        Task<bool> DeactivateByVendorId(int id);
        Task<bool> ReactivateByVendorId(int id);
        Task<VendorServices> GetById(int id);
        Task<List<VendorServices>> Search(VendorSearchProperties properties);
    }
}
