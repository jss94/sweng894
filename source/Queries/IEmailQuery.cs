using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using source.Models;

namespace source.Queries
{
    public interface IEmailQuery
    {
        
        Task<HttpStatusCode> sendEmailViaPostAsync(EmailMessage emailMsg);

        string getBaseUrlForEmail(HttpContext context);

    }
}