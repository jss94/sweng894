using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Mvc;
using source.BusinessLogic;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace source.Controllers
{
    /// <summary>
    /// Google calendar controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private CalendarBusinessLogic calendarBL;

        /// <summary>
        /// Constructor
        /// </summary>
        public CalendarController()
        {
            calendarBL = new CalendarBusinessLogic();
        }

        /// <summary>
        /// GET api/guest/event/{eventId}
        /// Gets the list of guests for an event
        /// </summary>
        /// <param name="eventId">Event Id</param>
        /// <returns>List of guests</returns>
        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetCalendarEvents(int eventId)
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
    }
}
