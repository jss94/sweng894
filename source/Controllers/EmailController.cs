using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;
using source.Models;

namespace source.Controllers
{
    /// <summary>
    /// Email controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public EmailController()
        {}

        /// <summary>
        /// Sends an Email given a message
        /// </summary>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation.</param>
        [HttpPost]
        public async Task<IActionResult> sendEmail([FromBody]EmailMessage emailMsg)
        {
            Console.WriteLine("Message Received with Subject:" + emailMsg.subject);

            var client = new SendGridClient("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");

            string data = @"{
  'personalizations': [{ 'to': [{ 'email': 'senky.joe@gmail.com' }] }],
  'from': { 'email': 'test@example.com' },
  'subject': 'Sending with SendGrid is Fun',
  'content': [
    { 'type': 'text/plain', 'value': 'and easy to do anywhere, even with cURL' }
  ]
}
";

            // {"personalizations":[{"to":[{"email":"senky.joe@gmail.com"}]}],"content":[{"type":"type/plain","value":"Welcome!!!"}],"from":"jss94@psu.edu","subject":"Email from SWENG 894 Occasions"}
            //  Object json = JsonConvert.DeserializeObject<Object>(data);
            // data = json.ToString();

            try
            {
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(emailMsg);
                Console.WriteLine("HELLO!!!" + jsonString);

                var response = await client.RequestAsync(method: SendGridClient.Method.POST, urlPath: "mail/send", requestBody: jsonString);
                Console.WriteLine(response.StatusCode);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new BadRequestResult();
            }
           
            return new OkObjectResult("success");
        }
    }
}
