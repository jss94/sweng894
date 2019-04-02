using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class Promotion

    {
        // promotion identifier
        public int promotionId { get; set; }

        // reference to the vendor who created the promotion.
        public int vendorId { get; set; }
        
        //The date that the promotion will start.
        public string startDate { get; set; }

        //The date that the promotion will end.
        public string endDate { get; set; }

        public string description { get; set; }
    }
}
