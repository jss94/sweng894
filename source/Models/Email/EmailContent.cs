using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models.Email
{
    public class EmailContent
    {
        public EmailContent()
        {
            // empty constructor
        }

        public EmailContent(string type, string value)
        {
            this.type = type;
            this.value = value;
        }
        public string type { get; set; }

        public string value { get; set; }
    }
}
