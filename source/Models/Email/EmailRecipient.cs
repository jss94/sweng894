using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models.Email
{
    public class EmailRecipient
    {
        public EmailRecipient()
        {
            //empty constructor
        }

        public EmailRecipient(string email)
        {
            this.email = email;
        }

        public EmailRecipient(string name, string email)
        {
            this.name = name;
            this.email = email;
        }

        public string name { get; set; }
        public string email { get; set; }
    }
}
