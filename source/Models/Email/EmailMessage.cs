using source.Models.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class EmailMessage

    {
        public EmailPersonalization[] personalizations;
        public EmailRecipient from { get; set; }
        public string subject { get; set; }
        public EmailContent[] content;

    }
}
