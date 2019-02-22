using source.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class VendorSearchProperties
    {
        public int maxPrice { get; set; }
        public int maxCapacity { get; set; }
        public int? zip { get; set; }
        public string type { get; set; }
    }
}
