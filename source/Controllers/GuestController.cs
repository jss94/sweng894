using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics.Tracing;

namespace source.Controllers
{
    /// <summary>
    /// Guest Controller
    /// </summary>
    [Route("api/[controller]")]
    public class GuestController
    {
        private IGuestQuery _query;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IGuestQuery object handled by dependency injection</param>
        public GuestController(IGuestQuery query)
        {
            _query = query;
        }

        /// <summary>
        /// GET api/guest/event/{eventId}
        /// Gets the list of guests for an event
        /// </summary>
        /// <param name="eventId">Event Id</param>
        /// <returns>List of guests</returns>
        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetListByEventId (int eventId)
        {
            try
            {
                return new OkObjectResult(await _query.GetListByEventId(eventId));
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// GET api/guest/event/{eventId}
        /// Gets the list of guests for an event
        /// </summary>
        /// <param name="guid">GUID</param>
        /// <returns>List of guests</returns>
        [HttpGet("event/guid/{guid}")]
        public async Task<IActionResult> GetListByEventGuid(string guid)
        {
            try
            {
                var guests = await _query.GetListByEventGuid(guid);

                if (guests == null || guests.Count == 0)
                    return new NotFoundResult();

                return new OkObjectResult(guests);
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// GET api/guest/{guestId}
        /// Gets the list of guests for an event
        /// </summary>
        /// <param name="guestId">Guest Id</param>
        /// <returns>List of guests</returns>
        [HttpGet("{guestId}")]
        public async Task<IActionResult> GetGuestById(int guestId)
        {
            try
            {
                return new OkObjectResult(await _query.GetByGuestId(guestId));
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// POST api/guest/{insert}
        /// Inserts a new guest record
        /// </summary>
        /// <param name="guest">Guest</param>
        /// <returns>New Guest record</returns>
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody]Guest guest)
        {
            try
            {
                await _query.Insert(guest);
                return new OkObjectResult(true);
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// POST api/guest/{update}
        /// Updates a guest record
        /// </summary>
        /// <param name="guest">Guest</param>
        /// <returns>Updated Guest record</returns>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Guest guest)
        {
            try
            {
                var existingGuest = _query.GetByGuestId(guest.guestId);

                if (existingGuest == null)
                    return new NotFoundResult();

                await _query.Update(guest);

                return new OkObjectResult(true);
            }
            catch (Exception e)
            {
                //TODO: we should log our errors in the db
                Console.WriteLine(e.StackTrace);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Updates a guest record to include the RSVP
        /// </summary>
        /// <param name="guestId">Guest</param>
        /// <param name="isGoing">Query parameter either true or false, to specify the RSVP.</param>
        /// <returns>Updated RSVP for Guest record</returns>
        [HttpGet("rsvp/{guestId}")]
        public async Task<IActionResult> UpdateRsvp(int guestId, [FromQuery]String isGoing)
        {
            try
            {
                Guest guest = await _query.GetByGuestId(guestId);
                OkObjectResult response = null;
                if(Boolean.Parse(isGoing))
                {
                    response = new OkObjectResult("Great! Can't wait to see you!");
                    guest.isGoing = true;
                } else
                {
                    response = new OkObjectResult("Sorry to see you can't make it :(");
                    guest.isGoing = false;
                }

                await _query.Update(guest);
                
                return response;
            }
            catch (Exception e)
            {
                //TODO: we should log our errors in the db
                Console.WriteLine(e.StackTrace);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// DELETE api/guest/{id}
        /// Deletes a guest
        /// </summary>
        /// <param name="id">Event Id</param>
        /// <returns>True if successful</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteByGuestId(int id)
        {
            try
            {
                var events = await _query.GetByGuestId(id);

                if (events == null) 
                {
                    return new NotFoundResult();
                }

                await _query.DeleteByGuestId(id);
                return new OkObjectResult(true);
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }
        
    }
}
