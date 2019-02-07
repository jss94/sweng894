using source.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class VendorServices
    {
        public int id;
        public int vendorId;
        public string serviceType;
        public string serviceName;
        public string serviceDescription;
        public bool flatFee;
        public float price;
        public int unitsAvailable;
    }
}
