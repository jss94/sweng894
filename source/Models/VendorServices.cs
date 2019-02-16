using source.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class VendorServices
    {
        public int? id { get; set; }
        public int?vendorId { get; set; }
        public string serviceType { get; set; }
        public string serviceName { get; set; }
        public string serviceDescription { get; set; }
        public bool? flatFee { get; set; }
        public float? price { get; set; }
        public int? unitsAvailable { get; set; }
    }
}
