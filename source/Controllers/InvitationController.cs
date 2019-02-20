using System;
using source.Framework;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using source.Queries;
using System.Net;

namespace source.Controllers
{
    /// <summary>
    /// Email controller.
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
        /// Saves the given invitation with the associated event id.
        /// </summary>
        /// <param name="eventId">The id of the Event for which the invitation is for.</param>
        /// <param name="invitationContent">The content of the invitation</param>
        [HttpPost]
        public async Task<HttpStatusCode> postInvitation(int eventId, [FromBody]String invitationContent)
        {
            try
            {
                await _invitationQuery.saveInvitation(eventId, invitationContent);
                return HttpStatusCode.OK;
            } catch (Exception e)
            {
                return HttpStatusCode.BadRequest;
            }

        }

        /// <summary>
        /// Gets the invitation associated with the given event id.
        /// </summary>
        /// <param name="eventId">The id of the Event.</param>
        [HttpGet]
        public async Task<String> getInvitation(int eventId)
        {
            // retrieve invitation associated to event.
            return await _invitationQuery.getInvitation(eventId);
            
        }

        /// <summary>
        /// Updates an invitation associated with the given event id.
        /// </summary>
        /// <param name="eventId">The id of the Event.</param>
        /// <param name="content">The content of the invitation.</param>
        [HttpPut]
        public async Task<bool> putInvitation(int eventId, String content)
        {
            try
            {
                await _invitationQuery.updateInvitation(eventId, content);
                return true;
            }catch(Exception e)
            {
                return false;
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
                return false;
            }
        }
    }
}
