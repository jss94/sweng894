using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using source.Constants;
using source.Framework;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    /// <summary>
    /// Vendor Controller
    /// </summary>
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {
        private IVendorsQuery _vendorQuery;
        private IAddressesQuery _addressesQuery;
        private IVendorServicesQuery _servicesQuery;
        private IEventQuery _eventsQuery;
        private IGuestQuery _guestsQuery;
        private ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:source.Controllers.VendorsController"/> class.
        /// </summary>
        /// <param name="vendorQuery">Vendor query.</param>
        /// <param name="addressQuery">Address query.</param>
        /// <param name="serviceQuery">Service query.</param>
        /// <param name="eventsQuery">Events query.</param>
        /// <param name="guestsQuery">Guests query.</param>
        /// <param name="logger">Logger.</param>
        public VendorsController(
            IVendorsQuery vendorQuery, 
            IAddressesQuery addressQuery,
            IVendorServicesQuery serviceQuery,
            IEventQuery eventsQuery,
            IGuestQuery guestsQuery,
            ILogger logger)
        {
            _vendorQuery = vendorQuery;
            _addressesQuery = addressQuery;
            _servicesQuery = serviceQuery;
            _eventsQuery = eventsQuery;
            _guestsQuery = guestsQuery;

            _logger = logger;
        }

        /// <summary>
        /// Gets all vendors
        /// </summary>
        /// <returns>List of Vendor</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _vendorQuery.GetAll();
                if(result == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets a vendor by the vendor id
        /// </summary>
        /// <param name="id">Vendor id</param>
        /// <returns>Vendor</returns>
        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var vendor = await _vendorQuery.GetById(id);

                if (vendor == null)
                    return new NotFoundResult();

                return new OkObjectResult(vendor);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets a single vendor by user name
        /// </summary>
        /// <param name="userName">Vendor's unique user name </param>
        /// <returns>Vendor</returns>
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetByUserName(string userName)
        {
            try
            {
                var vendor = await _vendorQuery.GetByUserName(userName);

                if (vendor == null)
                    return new NotFoundResult();

                return new OkObjectResult(vendor);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Inserts a new vendor record
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>New Vendor record</returns>
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody]Vendor vendor)
        {
            try
            {
                if (vendor.address != null)
                {
                    await _addressesQuery.Insert(vendor.address);
                }

                return new OkObjectResult(await _vendorQuery.Insert(vendor));
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Updates a vendor record
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>True/False</returns>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Vendor vendor)
        {
            try
            {
                var address = await _addressesQuery.GetByUserName(vendor.userName);
                if (address == null)
                {
                    await _addressesQuery.Insert(vendor.address);
                } 
                else
                {
                    await _addressesQuery.Update(vendor.address);
                }

                var result = await _vendorQuery.GetByUserName(vendor.userName);

                if (result == null)
                    return new NotFoundResult();

                await _vendorQuery.Update(vendor);
                return new OkObjectResult(true);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Deactivate the specified userName.
        /// </summary>
        /// <returns>The deactivate.</returns>
        /// <param name="userName">User name.</param>
        [HttpPut("{userName}")]
        public async Task<IActionResult> Deactivate(string userName)
        {
            try
            {
                var vendor = await _vendorQuery.GetByUserName(userName);

                if (vendor == null)
                {
                    return new NotFoundResult();
                }

                await _vendorQuery.Deactivate(userName);
                await _addressesQuery.Deactivate(userName);
                await _servicesQuery.DeactivateByVendorId(vendor.id.Value);

                var events = await _eventsQuery.GetAllEventsByUser(userName);

                if (events != null)
                {
                    await _eventsQuery.DeleteByUserName(userName);

                    foreach(var e in events)
                    {
                        await _guestsQuery.DeleteByEventId(e.eventId);
                    }
                }

                return new OkObjectResult(true);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Deactivate the specified vendor.
        /// </summary>
        /// <returns>True/False</returns>
        /// <param name="id">Vendor ID.</param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                bool result = await _vendorQuery.Delete(id);

                if (result == false)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }
    }
}