﻿using System.Threading.Tasks;
using source.Models;
using System.Net;
using SendGrid;
using System;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace source.Queries
{
    public class EmailQuery : IEmailQuery
    {
        private ILoggerQuery _logger;

        public EmailQuery(ILoggerQuery loggerQuery)
        {
            _logger = loggerQuery;
        }
        
        /// <summary>
        /// Given an EmailMessage object, converts it to JSON and sends it via the sendGrid API.
        /// </summary>
        /// <param name="emailMsg">A EmailMessage.</param>
        public async Task<HttpStatusCode> sendEmailViaPostAsync(EmailMessage emailMsg)
        {
            var client = new SendGridClient(Constants.EmailApiKey.SEND_GRID_API_KEY);

            try
            {
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(emailMsg);
                var response = await client.RequestAsync(method: SendGridClient.Method.POST, urlPath: "mail/send", requestBody: jsonString);
                return response.StatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return HttpStatusCode.BadRequest;
            }
        }

        public string getBaseUrlForEmail(HttpContext context)
        {
            StringBuilder builder = new StringBuilder();
            
            if(context.Request.IsHttps)
            {
                builder.Append("https://");
            } else
            {
                builder.Append("http://");
            }
            builder.Append(context.Request.Host.ToString());
            return builder.ToString();
        }
    }
}