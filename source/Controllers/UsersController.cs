using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    /// <summary>
    /// Users controller.
    /// </summary>
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        IUsersQuery _usersQuery { get; set; }
        IVendorsQuery _vendorsQuery { get; set; }
        IEventQuery _eventsQuery { get; set; }
        IGuestQuery _guestsQuery { get; set; }
        IAddressesQuery _addressesQuery { get; set; }
        IVendorServicesQuery _servicesQuery { get; set; }

        public UsersController(
            IUsersQuery usersQuery,
            IVendorsQuery vendorsQuery,
            IEventQuery eventQuery,
            IGuestQuery guestQuery,
            IAddressesQuery addressesQuery,
            IVendorServicesQuery servicesQuery
            )
        {
            _usersQuery = usersQuery;
            _vendorsQuery = vendorsQuery;
            _eventsQuery = eventQuery;
            _guestsQuery = guestQuery;
            _addressesQuery = addressesQuery;
            _servicesQuery = servicesQuery;
        }

        /// <summary>
        /// GET api/users/{userId}
        /// Gets the user.
        /// </summary>
        /// <returns>The user.</returns>
        /// <param name="userId">User identifier.</param>
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var result = await _usersQuery.GetByUserName(userId);

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        /// <summary>
        /// GET api/users
        /// Gets all.
        /// </summary>
        /// <returns>The all.</returns>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var result = await _usersQuery.GetAll();

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);

        }

        /// <summary>
        /// Insert the specified user.
        /// </summary>
        /// <returns>The post.</returns>
        /// <param name="user">User.</param>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]User user)
        {
            var result = await _usersQuery.GetByUserName(user.userName);

            if (result == null)
            {
                await _usersQuery.Insert(user);
                return new OkObjectResult(true);
            }

            return new BadRequestResult();
        }

        /// <summary>
        /// PUT api/users/{userId}
        /// Update the specified userId and body.
        /// </summary>
        /// <returns>The put.</returns>
        /// <param name="body">Body.</param>
        [HttpPut]
        public async Task<IActionResult> Put([FromBody]User body)
        {
            var user = await _usersQuery.GetByUserName(body.userName);

            if (user == null)
                return new NotFoundResult();

            user.userName = body.userName;
            user.name = body.name;
            user.role = body.role;

            await _usersQuery.Update(user);

            return new OkObjectResult(true);

        }

        /// <summary>
        /// Deactivate the specified userName.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="userName">User name.</param>
        [HttpPut("deactivate/{userName}")]
        public async Task<IActionResult> Deactivate(string userName)
        {
            var user = await _usersQuery.GetByUserName(userName);

            if (user == null)
                return new NotFoundResult();

            await _usersQuery.Deactivate(user);

            await _addressesQuery.Deactivate(userName);

            var vendor = await _vendorsQuery.GetByUserName(userName);

            if (vendor != null)
            {
                await _vendorsQuery.Deactivate(user.userName);
                await _servicesQuery.DeactivateByVendorId(vendor.id.Value);

                var events = await _eventsQuery.GetAllEventsByUser(userName);

                if (events != null || events.Count > 0)
                {
                    await _eventsQuery.DeleteByUserName(userName);
                    // guests are deleted automatically by DB
                }
            }

            return new OkResult();

        }

        /// <summary>
        /// PUT api/users/{userId}
        /// Reactivate the specified userId.
        /// </summary>
        /// <returns>The delete.</returns>
        /// <param name="userId">User identifier.</param>
        [HttpPut("reactivate/{userId}")]
        public async Task<IActionResult> Reactivate(string userId)
        {
            var result = await _usersQuery.GetByUserName(userId, isActive: false);

            if (result == null)
                return new NotFoundResult();

            await _usersQuery.Reactivate(result);
            await _vendorsQuery.Reactivate(result.userName);
            await _addressesQuery.Reactivate(result.userName);
            return new OkResult();

        }

        /// <summary>
        /// DELETE api/users/{userId}
        /// Deactivate the specified userId.
        /// </summary>
        /// <returns>The delete.</returns>
        /// <param name="userId">User identifier.</param>
        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(string userId)
        {
            var result = await _usersQuery.GetByUserName(userId);

            if (result == null)
                return new NotFoundResult();

            await _usersQuery.Delete(result);
            return new OkResult();

        }
    }
}