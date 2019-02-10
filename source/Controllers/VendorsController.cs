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
        private ILogger _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="vendorQuery">IVendorsQuery obtained via dependency injection</param>
        /// <param name="addressQuery">IAddressQuery obtained via dependency injection</param>
        /// <param name="logger">ILogger obtained via dependency injection</param>
        public VendorsController(IVendorsQuery vendorQuery, IAddressesQuery addressQuery, ILogger logger)
        {
            _vendorQuery = vendorQuery;
            _addressesQuery = addressQuery;
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
                return new OkObjectResult(await _vendorQuery.GetAll());
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

                Console.WriteLine(vendor);
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
                if (vendor.address != null && vendor.address.city != null)
                {
                    var addressId = await _addressesQuery.Insert(vendor.address);
                    vendor.addressId = addressId;
                }

                await _vendorQuery.Insert(vendor);
                return new OkObjectResult(vendor);
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
        /// <returns>Updated Vendor record</returns>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Vendor vendor)
        {
            try
            {
                return new OkObjectResult(await _vendorQuery.Update(vendor));
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Marks a vendor record as inactive
        /// </summary>
        /// <param name="id">Vendor ID</param>
        /// <returns>True if successful</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Deactivate(int id)
        {
            try
            {
                var vendor = await _vendorQuery.GetById(id);

                if (vendor == null)
                {
                    return new NotFoundResult();
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