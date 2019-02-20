using System;
using source.Framework;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using source.Queries;
using System.Net;
using source.Models;

namespace source.Controllers
{
    /// <summary>
    /// Invitation controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class InvitationController : ControllerBase
    {
        private IInvitationQuery _invitationQuery;
        private ILogger _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        public InvitationController(IInvitationQuery invitationQuery, ILogger logger)
        {
            _invitationQuery = invitationQuery;
            _logger = logger;
        }

        /// <summary>
        /// Saves the given invitation.
        /// </summary>
        /// <param name="invitation">The content of the invitation</param>
        [HttpPost]
        public async Task<HttpStatusCode> postInvitation([FromBody]Invitation invitation)
        {
            try
            {
                await _invitationQuery.saveInvitation(invitation);
                return HttpStatusCode.OK;
            } catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return HttpStatusCode.BadRequest;
            }

        }

        /// <summary>
        /// Gets the invitation associated with the given event id.
        /// </summary>
        /// <param name="eventId">The id of the Event.</param>
        [HttpGet("{eventId}")]
        public async Task<Invitation> getInvitation(int eventId)
        {
            // retrieve invitation associated to event.
            return await _invitationQuery.getInvitation(eventId);
            
        }

        /// <summary>
        /// Updates an invitation with the given one
        /// </summary>
        /// <param name="invitation">The id of the Event.</param>
        [HttpPut]
        public async Task<HttpStatusCode> putInvitation(Invitation invitation)
        {
            try
            {
                await _invitationQuery.updateInvitation(invitation);
                return HttpStatusCode.OK;
            }catch(Exception e)
            {

                Console.WriteLine(e.StackTrace);
                return HttpStatusCode.BadRequest;
            }
        }

        /// <summary>
        /// Deletes an invitation associated with the given event id.
        /// </summary>
        /// <param name="eventId">The id of the Event.</param>
        [HttpDelete]
        public async Task<bool> deleteInvitation(int eventId)
        {
            try
            {
                await _invitationQuery.deleteInvitation(eventId);
                return true;
            }catch(Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return false;
            }
        }
    }
}
