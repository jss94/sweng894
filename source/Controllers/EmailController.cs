using System;
using source.Framework;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
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

        private ILogger _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        public EmailController(ILogger logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Sends an Email given a message
        /// </summary>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost]
        public async Task<IActionResult> sendEmail([FromBody]EmailMessage emailMsg)
        {
            var client = new SendGridClient(Constants.EmailApiKey.SEND_GRID_API_KEY);
            
            try
            {
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(emailMsg);
                var response = await client.RequestAsync(method: SendGridClient.Method.POST, urlPath: "mail/send", requestBody: jsonString);
                return new OkObjectResult(response.StatusCode);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }
    }
}
