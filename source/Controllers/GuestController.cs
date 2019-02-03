using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        /// Gets the list of guests for an event
        /// </summary>
        /// <param name="id">Event Id</param>
        /// <returns>List of guests</returns>
        [HttpGet]
        public async Task<IActionResult> GetListByEventId (int id)
        {
            try
            {
                return new OkObjectResult(await _query.GetListByEventId(id));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Inserts a new guest record
        /// </summary>
        /// <param name="guest">Guest</param>
        /// <returns>New Guest record</returns>
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody]Guest guest)
        {
            try
            {
                return new OkObjectResult(await _query.Insert(guest));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Updates a guest record
        /// </summary>
        /// <param name="guest">Guest</param>
        /// <returns>Updated Guest record</returns>
        [HttpPost]
        public async Task<IActionResult> Update([FromBody]Guest guest)
        {
            try
            {
                return new OkObjectResult(await _query.Update(guest));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Deletes a guest
        /// </summary>
        /// <param name="id">Guest Id</param>
        /// <returns>True if successful</returns>
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                return new OkObjectResult(await _query.DeleteById(id));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }
    }
}
