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
        private IInvitationQuery _invitationQuery;
        private IReservationsQuery _reservationQuery;
        private IVendorServicesQuery _vendorServiceQuery;

        /// <summary>
        /// Constructor
        /// </summary>
        public EmailController(IVendorsQuery vendorQuery, IGuestQuery guestsQuery, ILogger logger, IEmailQuery emailQuery, IInvitationQuery invitationQuery, IReservationsQuery reservationQuery, IVendorServicesQuery vendorServiceQuery)
        {
            _vendorQuery = vendorQuery;
            _guestsQuery = guestsQuery;
            _logger = logger;
            _emailQuery = emailQuery;
            _invitationQuery = invitationQuery;
            _reservationQuery = reservationQuery;
            _vendorServiceQuery = vendorServiceQuery;
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
            
            emailMsg.personalizations[0].to[0].email = vendor.userName;
            return await _emailQuery.sendEmailViaPostAsync(emailMsg);
        }

        /// <summary>
        /// Sends the given email to a list of Guests for the given event id.
        /// </summary>
        /// <param name="eventGuid">The id of the Event.</param>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost("event/invitation/{eventGuid}")]
        public async Task<HttpStatusCode> PostEventInviteToGuests(string eventGuid, [FromBody]EmailMessage emailMsg)
        {

            // retrieve guest emails via event id
            List<Guest> eventGuests = await _guestsQuery.GetListByEventGuid(eventGuid);

            // check if guests are returned
            if (eventGuests == null || eventGuests.Count == 0)
                return HttpStatusCode.NotFound;
            
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
                
                emailContents.Add(_invitationQuery.updateInvitationContentToIncludeRSVP(guest, emailMsg.content[0], HttpContext));
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
        
        /// <summary>
        /// Sends the given email to the vendor to notify them of an available Reservation.
        /// </summary>
        /// <param name="reservationId">The id of the Reservation.</param>
        /// <param name="emailMsg">A EmailMessage. Initial Implementation - Converts to JSON and sends to SendGrid API.</param>
        [HttpPost("vendor/reservation/{reservationId}")]
        public async Task<HttpStatusCode> PostReservationToVendor(int reservationId, [FromBody]EmailMessage emailMsg)
        {
            
            // retrieve reservation via reservationId
            Reservation reservation = await _reservationQuery.GetById(reservationId);

            // check if reservation is returned
            if (reservation == null)
                return HttpStatusCode.NotFound;
            
            int vendorId = reservation.vendorId ?? default(int);
            Vendor vendor = await _vendorQuery.GetById(vendorId);

            if (vendor == null)
                return HttpStatusCode.NotFound;

            int vendorServiceId = reservation.vendorServiceId ?? default(int);
            VendorServices vendorService = await _vendorServiceQuery.GetById(vendorServiceId);

            if(vendorService == null)
            {
                return HttpStatusCode.NotFound;
            }

            Boolean isSuccessful = true;

            // create to list and set
            List<EmailPersonalization> personalizations = new List<EmailPersonalization>();
            List<EmailRecipient> emailTos = new List<EmailRecipient>();
            List<EmailContent> emailContents = new List<EmailContent>();
            EmailPersonalization personalization = new EmailPersonalization();

            emailTos.Add(new EmailRecipient(vendor.name, vendor.userName));
            personalization.to = emailTos;
            personalizations.Add(personalization);
            emailMsg.personalizations = personalizations;

            // Update Content
            String hostname = _emailQuery.getBaseUrlForEmail(HttpContext);

            EmailContent emailContent = new EmailContent();
            emailContent.type = "text/html";
            
            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.AppendLine("<div>").Append("Hello, ").Append(vendor.name).Append(". You have a requested reservation for the ");
            htmlBuilder.Append(vendorService.serviceName).Append(" waiting for you via Occasions.</div>");
            htmlBuilder.AppendLine("Please click ").Append("<a href='").Append(hostname).Append("/reservations-vendor'>here</a>").Append(" to view it.");     
            emailContent.value = htmlBuilder.ToString();
            Console.WriteLine(htmlBuilder.ToString());
            emailContents.Add(emailContent);
            emailMsg.content = emailContents;

            Task<HttpStatusCode> response = _emailQuery.sendEmailViaPostAsync(emailMsg);
            if (response.Result.Equals(HttpStatusCode.Accepted))
            {
                Console.WriteLine("Successfully sent email to " + vendor.userName);
            }
            else
            {
                isSuccessful = false;
                Console.WriteLine("Error sending email to " + vendor.userName);
            }
        
            if (isSuccessful)
            {
                return HttpStatusCode.Accepted;
            }
            else
            {
                return HttpStatusCode.BadRequest;
            }
        }

    }
}
