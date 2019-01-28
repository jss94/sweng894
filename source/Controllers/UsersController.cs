﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using source.Database;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    /// <summary>
    /// Users controller.
    /// </summary>
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        IUsersQuery _usersQuery { get; set; }
        IAddressesQuery _addressesQuery { get; set; }

        public UsersController(IUsersQuery usersQuery, IAddressesQuery addressesQuery)
        {
            _usersQuery = usersQuery;
            _addressesQuery = addressesQuery;
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
        public async Task<IActionResult> GetAll()
        {
            var result = await _usersQuery.GetAll();

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);

        }

        /// <summary>
        /// Post the specified user and address.
        /// </summary>
        /// <returns>The post.</returns>
        /// <param name="user">User.</param>
        /// <param name="address">Address.</param>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]User user)
        {
            var addressId = await _addressesQuery.Insert(user.address);
            user.addressId = addressId;

            await _usersQuery.Insert(user);
            return new OkObjectResult(user);
        }

        /// <summary>
        /// PUT api/users/{userId}
        /// Update the specified userId and body.
        /// </summary>
        /// <returns>The put.</returns>
        /// <param name="userId">User identifier.</param>
        /// <param name="body">Body.</param>
        [HttpPut("{userId}")]
        public async Task<IActionResult> Put(string userId, [FromBody]User body)
        {
            var result = await _usersQuery.GetByUserName(userId);

            if (result == null)
                return new NotFoundResult();

            result.userName = body.userName;
            result.name = body.name;
            result.role = body.role;
            await _usersQuery.Update(result);
            return new OkObjectResult(result);

        }

        /// <summary>
        /// DELETE api/users/{userId}
        /// Delete the specified userId.
        /// </summary>
        /// <returns>The delete.</returns>
        /// <param name="userId">User identifier.</param>
        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(string userId)
        {
            var result = await _usersQuery.GetByUserName(userId);

            if (result == null)
                return new NotFoundResult();

            await _usersQuery.Deactivate(result);
            return new OkResult();

        }
    }
}