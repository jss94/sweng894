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
        /// GET api/guest/{id}
        /// Gets the list of guests for an event
        /// </summary>
        /// <param name="id">Event Id</param>
        /// <returns>List of guests</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetListByEventId (int id)
        {
            try
            {
                return new OkObjectResult(await _query.GetListByEventId(id));
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
                await _query.Update(guest);
                return new OkObjectResult(true);
            }
            catch (Exception)
            {
                //TODO: we should log our errors in the db

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
