using System;
using source.Framework;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SendGrid;
using source.Models;
using source.Queries;
using System.Collections.Generic;
using source.Models.Email;
using System.Net;

namespace source.Controllers
{
    /// <summary>
    /// Email controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private IVendorsQuery _vendorQuery;
        private IGuestQuery _guestsQuery;
        private ILogger _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        public EmailController(IVendorsQuery vendorQuery, IGuestQuery guestsQuery, ILogger logger)
        {
            _vendorQuery = vendorQuery;
            _guestsQuery = guestsQuery;
            _logger = logger;
        }

        /// <summary>
        /// Sends the given email to the Vendor with the given id.
        /// </summary>
        /// <param name="id">The id of the Vendor.</param>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost("vendor/question/{id}")]
        public async Task<HttpStatusCode> PostQuestionToVendor(int id, [FromBody]EmailMessage emailMsg)
        {
            Vendor vendor = await _vendorQuery.GetById(id);

            if (vendor == null)
                return HttpStatusCode.NotFound;
            
            // TODO - Future - Do we want to always bcc the event organizer?
            emailMsg.personalizations[0].to[0].email = vendor.userName;
            return await sendEmail(emailMsg);
        }

        /// <summary>
        /// Sends the given email to a list of Guests for the given event id.
        /// </summary>
        /// <param name="id">The id of the Event.</param>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost("event/invitation/{id}")]
        public async Task<HttpStatusCode> PostEventInviteToGuests(int id, [FromBody]EmailMessage emailMsg)
        {
            // retrieve guest emails via event id
            List<Guest> eventGuests = await _guestsQuery.GetListByEventId(id);

            // check if guests are returned
            if (eventGuests == null || eventGuests.ToArray().Length ==0)
                return HttpStatusCode.NotFound;

            // create to list and set
            List<EmailRecipient> emailTos = new List<EmailRecipient>();

            eventGuests.ForEach(guest => {
                emailTos.Add(new EmailRecipient(guest.name, guest.email));
            });

            // add to list to email body
            // [0] because we currently only support "to". We do not support "cc" or "bcc" or any other personalizations.
            // Future - Do we want to always bcc the event organizer?
            emailMsg.personalizations[0].to = emailTos.ToArray();

            //send email
            return await sendEmail(emailMsg);
        }

        /// <summary>
        /// Private method that given an EmailMessage object, converts it to JSON and sends it via the sendGrid API.
        /// </summary>
        /// <param name="emailMsg">A EmailMessage.</param>
        private async Task<HttpStatusCode> sendEmail(EmailMessage emailMsg)
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
                await _logger.LogError(HttpContext.User, ex);
                return HttpStatusCode.BadRequest;
            }
        }
    }
}
