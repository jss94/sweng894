using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;

namespace source.Models
{
    public class EventOrganizer
    {
        public int id { get; set; }

        public string firstName { get; set; }

        public string lastName { get; set; }

        public string displayName { get; set; }

        public string emailAddress { get; set; }

        public SecureString password { get; set; }

        public string phoneNumber { get; set; }
    }
}
