using Microsoft.AspNetCore.Mvc;
using source.Constants;
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
    public class ReservationsController : ControllerBase
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
                if (reservations == null)
                    return new NotFoundResult();

                return new OkObjectResult(reservations);
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Inserts/creates a reservation
        /// </summary>
        /// <param name="reservation">Reservation</param>
        /// <returns>Reservation</returns>
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
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Updates a reservation
        /// </summary>
        /// <param name="reservation">Reservation</param>
        /// <returns>Reservation</returns>
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
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets all active reservations for vendor
        /// </summary>
        /// <param name="id">Vendor Id</param>
        /// <returns>List of Reservation</returns>
        [HttpGet("vendor/{id}")]
        public async Task<IActionResult> GetByVendor(int id)
        {
            try
            {
                List<Reservation> reservations = await _reservationsQuery.GetByVendor(id);
                if (reservations == null)
                    return new NotFoundResult();

                return new OkObjectResult(reservations);
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets all active reservations for event organizer (user)
        /// </summary>
        /// <param name="userName">UserName</param>
        /// <returns>List of Reservation</returns>
        [HttpGet("user/{userName}")]
        public async Task<IActionResult> GetByUser(string userName)
        {
            try
            {
                List<Reservation> reservations = await _reservationsQuery.GetByUserName(userName);
                if (reservations == null)
                    return new NotFoundResult();

                return new OkObjectResult(reservations);
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets the list of reservation status types
        /// </summary>
        /// <returns>List of reservation status types</returns>
        [HttpGet("statusTypes")]
        public IActionResult GetReservationStatusTypes()
        {
            try
            {
                ReservationStatus types = new ReservationStatus();
                return new OkObjectResult(types.GetReservationStatuses());
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Deactivates a reservation
        /// </summary>
        /// <param name="id">Reservation Id</param>
        /// <returns>True/False</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                bool result = await _reservationsQuery.Deactivate(id);

                if (result == false)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets a reservation by reservation id
        /// </summary>
        /// <param name="id">Reservation Id</param>
        /// <returns>Reservation</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                Reservation reservation = await _reservationsQuery.GetById(id);
                if (reservation == null)
                    return new NotFoundResult();

                return new OkObjectResult(reservation);
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets reservations for an event
        /// </summary>
        /// <param name="guid">Event Guid</param>
        /// <returns>List of Reservation</returns>
        [HttpGet("event/{guid}")]
        public async Task<IActionResult> GetByEventId(string guid)
        {
            try
            {
                List<Reservation> reservations = await _reservationsQuery.GetByEventId(guid);
                if (reservations == null)
                    return new NotFoundResult();

                return new OkObjectResult(reservations);
            }
            catch (Exception ex)
            {
                //await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }
    }
}
