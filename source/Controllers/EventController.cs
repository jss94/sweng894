using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {

        EventDao _eventDao { get; set; }


        public EventController(EventDao evntDao)
        {
            _eventDao = evntDao;
        }

        // GET: api/Event/
        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username)
        {
            var result = await _eventDao.GetAllEventsByUser(username);
            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        [HttpGet("{username}/{eventId}")]
        public async Task<IActionResult> Get(string username, string eventId)
        {
            var result = await _eventDao.GetOneEventById(eventId);

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        // POST: api/Event
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Event body)
        {
            await _eventDao.CreateNewEvent(body);
            return new OkObjectResult(body);
        }

        //--------------------NOT IMPLEMENTED--------------

        // PUT: api/Event/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
            throw new NotImplementedException();
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
