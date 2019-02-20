using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class Invitation

    {
        // unique number for invitation 
        public int id { get; set; }

        // unique number for event identifier
        public int eventId { get; set; }

        public String subject { get; set; }
        
        public String content { get; set; }
 
    }
}
