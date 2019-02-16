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
        /// <param name="id">The id of the Event.</param>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost("event/invitation/{id}")]
        public async Task<HttpStatusCode> PostEventInviteToGuests(int id, [FromBody]EmailMessage emailMsg)
        {
            // retrieve guest emails via event id
            List<Guest> eventGuests = await _guestsQuery.GetListByEventId(id);

            // check if guests are returned
            if (eventGuests == null || eventGuests.ToArray().Length == 0)
                return HttpStatusCode.NotFound;

            // create to list and set
            List<EmailPersonalization> personalizations = new List<EmailPersonalization>();
            List<EmailRecipient> emailTos = new List<EmailRecipient>();
            EmailPersonalization personalization = new EmailPersonalization();

            // TODO - Instead of emailing all of the guests in one email, they should probably
            // be emailed individually.  This would allow for a RSVP link to be embedded into the content.
            eventGuests.ForEach(guest => {
                emailTos.Add(new EmailRecipient(guest.name, guest.email));
            });
            personalization.to = emailTos;
            personalizations.Add(personalization);
          
            emailMsg.personalizations = personalizations;

            //send email
            return await _emailQuery.sendEmailViaPostAsync(emailMsg);
        }

       
    }
}
