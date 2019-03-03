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
    /// Vendor Services Controller
    /// </summary>
    [Route("api/[controller]")]
    public class VendorServicesController : ControllerBase
    {
        /// <summary>
        /// vendor services query
        /// </summary>
        private IVendorServicesQuery _vendorServicesQuery;

        /// <summary>
        /// logger utility
        /// </summary>
        private ILogger _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="vendorServicesQuery">IVendorServicesQuery obtained via dependency injection</param>
        /// <param name="logger">ILogger obtained via dependency injection</param>
        public VendorServicesController(IVendorServicesQuery vendorServicesQuery, ILogger logger)
        {
            _vendorServicesQuery = vendorServicesQuery;
            _logger = logger;
        }

        /// <summary>
        /// Gets the list of service types for vendors' services
        /// </summary>
        /// <returns>List of vendor service types</returns>
        [HttpGet("types")]
        public async Task<IActionResult> GetVendorServiceTypes()
        {
            try
            {
                VendorServiceTypes types = new VendorServiceTypes();
                return new OkObjectResult(types.GetVendorServiceTypes());
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets list of vendors by service type
        /// </summary>
        /// <param name="serviceType">Service type</param>
        /// <returns>List of vendors with requested service type</returns>
        [HttpGet("{serviceType}")]
        public async Task<ActionResult> GetVendorsByServiceType(string serviceType)
        {
            try
            {
                List<Vendor> vendors = new List<Vendor>();
                vendors = await _vendorServicesQuery.GetVendorsByServiceTypes(serviceType);

                if (vendors == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(vendors);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets list of all vendor services
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                List<VendorServices> services = await _vendorServicesQuery.GetAll();
                if (services == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(services);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Inserts a new vendor service
        /// </summary>
        /// <param name="service">The new vendor service</param>
        /// <returns>Saved vendor service</returns>
        [HttpPost]
        public async Task<IActionResult> Insert([FromBody]VendorServices service)
        {
            try
            {
                VendorServices newService = await _vendorServicesQuery.InsertService(service);
                if (newService == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(newService);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Updates a vendors service
        /// </summary>
        /// <param name="service">Service to be updated</param>
        /// <returns>Saved vendor service</returns>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody]VendorServices service)
        {
            try
            {
                VendorServices newService = await _vendorServicesQuery.UpdateService(service);
                if (newService == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(newService);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets services by vendor
        /// </summary>
        /// <param name="id">Vendor id</param>
        /// <returns>List of vendor services</returns>
        [HttpGet("vendor/{id}")]
        public async Task<ActionResult> GetServicesByVendor(int id)
        {
            try
            {
                List<VendorServices> services = new List<VendorServices>();
                services = await _vendorServicesQuery.GetServicesByVendor(id);

                if (services == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(services);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Deactivate a service
        /// </summary>
        /// <param name="id">Service id</param>
        /// <returns>True/False</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                bool result = await _vendorServicesQuery.DeactivateByServiceId(id);

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

        /// <summary>
        /// Gets a vendor service by vendor service id
        /// </summary>
        /// <returns></returns>
        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            try
            {
                VendorServices service = await _vendorServicesQuery.GetById(id);
                if (service == null)
                {
                    return new NotFoundResult();
                }

                return new OkObjectResult(service);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        /// <summary>
        /// Gets a vendor service by vendor service search properties
        /// </summary>
        /// <returns></returns>
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] VendorSearchProperties properties)
        {
            try
            {
                var result = await _vendorServicesQuery.Search(properties);

                if (result == null)
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