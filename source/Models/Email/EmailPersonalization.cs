using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models.Email
{
    public class EmailPersonalization
    {
        public EmailPersonalization()
        {
            to = new List<EmailRecipient>();
        }

        public List<EmailRecipient> to { get; set; }
    }
}
