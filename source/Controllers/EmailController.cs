using System;
using source.Framework;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Queries;
using System.Collections.Generic;
using source.Models.Email;
using System.Net;
using System.Text;

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
        private IEmailQuery _emailQuery;

        /// <summary>
        /// Constructor
        /// </summary>
        public EmailController(IVendorsQuery vendorQuery, IGuestQuery guestsQuery, ILogger logger, IEmailQuery emailQuery)
        {
            _vendorQuery = vendorQuery;
            _guestsQuery = guestsQuery;
            _logger = logger;
            _emailQuery = emailQuery;
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
            return await _emailQuery.sendEmailViaPostAsync(emailMsg);
        }

        /// <summary>
        /// Sends the given email to a list of Guests for the given event id.
        /// </summary>
        /// <param name="eventId">The id of the Event.</param>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost("event/invitation/{eventId}")]
        public async Task<HttpStatusCode> PostEventInviteToGuests(int eventId, [FromBody]EmailMessage emailMsg)
        {
            // retrieve guest emails via event id
            List<Guest> eventGuests = await _guestsQuery.GetListByEventId(eventId);

            // check if guests are returned
            if (eventGuests == null || eventGuests.ToArray().Length == 0)
                return HttpStatusCode.NotFound;

            String originalContent = emailMsg.content[0].value;

            Boolean isSuccessful = true;
            // TODO - Instead of emailing all of the guests in one email, they should probably
            // be emailed individually.  This would allow for a RSVP link to be embedded into the content.
            eventGuests.ForEach(guest => {
                // create to list and set
                List<EmailPersonalization> personalizations = new List<EmailPersonalization>();
                List<EmailRecipient> emailTos = new List<EmailRecipient>();
                List<EmailContent> emailContents = new List<EmailContent>();
                EmailPersonalization personalization = new EmailPersonalization();

                emailTos.Add(new EmailRecipient(guest.name, guest.email));
                personalization.to = emailTos;
                personalizations.Add(personalization);
                emailMsg.personalizations = personalizations;
                
                emailContents.Add(updateEmailContentToIncludeRSVP(guest.guestId, originalContent));
                emailMsg.content = emailContents;

                Task<HttpStatusCode> response = _emailQuery.sendEmailViaPostAsync(emailMsg);
                if ( response.Result.Equals(HttpStatusCode.Accepted))
                {
                    Console.WriteLine("Successfully sent email to " + guest.email);
                } else
                {
                    isSuccessful = false;
                    Console.WriteLine("Error sending email to " + guest.guestId + " at " + guest.email);
                }
            });
          

            if(isSuccessful)
            {
                return HttpStatusCode.Accepted;
            } else
            {
                return HttpStatusCode.BadRequest;
            }
        }

        private EmailContent updateEmailContentToIncludeRSVP(int guestId, string content)
        {
            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.AppendLine("<div>").Append(content).Append("</div>");
            htmlBuilder.AppendLine(createRsvpLinkContent(guestId));
           // htmlBuilder.AppendLine("</body></html>");

            EmailContent emailContent = new EmailContent("text/html", htmlBuilder.ToString());
            return emailContent;
        }

        private string createRsvpLinkContent(int guestId)
        {
            String hostName = System.Net.Dns.GetHostName();
            StringBuilder sb = new StringBuilder();
            sb.Append("<div>RSVP</div>");
            sb.AppendLine("<div><a href='https://").Append(hostName).Append(":5001/guest/rsvp/");
            sb.Append(guestId).Append("?isGoing=true");
            sb.Append("'>Going</a></div>");
            sb.AppendLine("<div><a href='https://").Append(hostName).Append(":5001/guest/rsvp/");
            sb.Append(guestId).Append("?isGoing=false");
            sb.Append("'>Not Going</a></div>"); ;
            return sb.ToString();
        }


    }
}
