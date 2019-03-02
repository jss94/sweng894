using Microsoft.AspNetCore.Mvc;
using source.Framework;
using source.Models;
using source.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Controllers
{
    /// <summary>
    /// Reservations controller.
    /// </summary>
    [Route("api/[controller]")]
    public class ReservationsController: ControllerBase
    {
        /// <summary>
        /// Logger for controller
        /// </summary>
        private ILogger _logger;

        /// <summary>
        /// Reservations repository
        /// </summary>
        private IReservationsQuery _reservationsQuery;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="reservationsQuery">Reservations query provided via dependency injection</param>
        /// <param name="logger">Logger provided via dependency injection</param>
        public ReservationsController(IReservationsQuery reservationsQuery, ILogger logger)
        {
            _reservationsQuery = reservationsQuery;
            _logger = logger;
        }

        /// <summary>
        /// Gets all active reservations
        /// </summary>
        /// <returns>List of Reservation</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                List<Reservation> reservations = await _reservationsQuery.GetAll();
                if(reservations == null)
                    return new NotFoundResult();

                return new OkObjectResult(reservations);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }
                
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody]Reservation reservation)
        {
            try
            {
                var savedReservation = await _reservationsQuery.Insert(reservation);
                return new OkObjectResult(savedReservation);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Reservation reservation)
        {
            try
            {
                var savedReservation = await _reservationsQuery.Update(reservation);
                return new OkObjectResult(savedReservation);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }



    }
}
