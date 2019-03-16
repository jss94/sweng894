using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class MonthlyReservationSalesMetric

    {
        public string month { get; set; }
        
        public string name{ get; set; }

        public string serviceType { get; set; }

        public string serviceName { get; set; }

        public float price { get; set; }

        public Boolean flatFee { get; set; }

        public int numberReserved { get; set; }
        
    }
}
