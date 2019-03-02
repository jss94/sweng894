using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class Reservation
    {
        public int? id { get; set; }
        public string userName { get; set; }
        public int? eventId { get; set; }
        public int? vendorId { get; set; }
        public int? vendorServiceId { get; set; }
        public string status { get; set; }
        public int numberReserved { get; set; }
        public VendorServices vendorService { get; set; }
        public Event evt { get; set; }
        public Vendor vendor { get; set; }
    }
}
