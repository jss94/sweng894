﻿using System;
using source.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using source.Models;
using source.Framework;

namespace source.Controllers
{
    /// <summary>
    /// Vendor Controller
    /// </summary>
    [Route("api/[controller]")]
    public class VendorsController
    {
        private IVendorsQuery _vendorQuery;
        private IAddressesQuery _addressesQuery;
        private ILogger _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IVendorsQuery obtained via dependency injection</param>
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
            catch(Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets a vendor by the vendor id
        /// </summary>
        /// <param name="id">Vendor id</param>
        /// <returns>Vendor</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                return new OkObjectResult(await _vendorQuery.GetById(id));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets a single vendor by user name
        /// </summary>
        /// <param name="userName">Vendor's unique user name </param>
        /// <returns>Vendor</returns>
        [HttpGet("userName")]
        public async Task<IActionResult> GetByUserName(string userName)
        {
            try
            {
                var vendor = await _vendorQuery.GetByUserName(userName);

                if (vendor == null)
                    return new BadRequestResult();

                return new OkObjectResult(vendor);
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

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
                var addressId = await _addressesQuery.Insert(vendor.address);
                vendor.addressId = addressId;

                await _vendorQuery.Insert(vendor);
                return new OkObjectResult(vendor);
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

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
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Marks a vendor record as inactive
        /// </summary>
        /// <param name="vendor">Vendor</param>
        /// <returns>True if successful</returns>
        [HttpPut]
        public async Task<IActionResult> Deactivate([FromBody]Vendor vendor)
        {
            try
            {
                return new OkObjectResult(await _vendorQuery.Deactivate(vendor));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Delete the specified vendor.
        /// </summary>
        /// <returns>The delete.</returns>
        /// <param name="vendor">Vendor.</param>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody]Vendor vendor)
        {
            try
            {
                return new OkObjectResult(await _vendorQuery.Delete(vendor));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }
    }

}