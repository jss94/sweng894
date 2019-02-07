using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Constants
{
    public class VendorServiceTypes
    {
        private List<string> VendorTypes = new List<string>
        { "Venue", "Catering", "Flowers", "Supplies", "Lodging", "Activities", "Other" };

        public List<string> GetVendorServiceTypes()
        {
            return VendorTypes;
        }
    }
}
