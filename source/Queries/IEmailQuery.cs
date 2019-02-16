using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IEmailQuery
    {
        
        Task<HttpStatusCode> sendEmailViaPostAsync(EmailMessage emailMsg);


    }
}