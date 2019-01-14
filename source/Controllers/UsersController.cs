using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using source.Database;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
       IUsersQuery _usersQuery { get; set; }

        public UsersController(IUsersQuery usersQuery)
        {
            _usersQuery = usersQuery;
        }

        // GET api/users/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var result = await _usersQuery.GetOneAsync(userId);

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);

        }

        // GET api/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _usersQuery.GetAllAsync();

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);

        }

        // POST api/users
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]User body)
        { 
            await body.InsertAsync();
            return new OkObjectResult(body);
        }

        // PUT api/users/{userId}
        [HttpPut("{userId}")]
        public async Task<IActionResult> Put(string userId, [FromBody]User body)
        {
            var result = await _usersQuery.GetOneAsync(userId);

            if (result == null)
                return new NotFoundResult();

            result.name = body.name;
            result.role = body.role;
            await result.UpdateAsync();
            return new OkObjectResult(result);

        }

        // DELETE api/async/5
        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(string userId)
        {
            var result = await _usersQuery.GetOneAsync(userId);

            if (result == null)
                return new NotFoundResult();

            await result.DeleteAsync();
            return new OkResult();

        }
    }
}