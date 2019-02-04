using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using source.Framework;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    /// <summary>
    /// Vendor Controller
    /// </summary>
    [Route("api/[controller]")]
    public class VendorsController: ControllerBase
    {
        private IVendorsQuery _query;
        private ILogger _logger;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IVendorsQuery obtained via dependency injection</param>
        public VendorsController(IVendorsQuery query, ILogger logger)
        {
            _query = query;
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
                //Example 1: exception is handled
                throw new Exception();
                return new OkObjectResult(await _query.GetAllAsync());
            }
            catch(Exception ex)
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
                //Example 2: Exception is unhandled
                throw new Exception();
                return new OkObjectResult(await _query.GetById(id));
            
        }

        /// <summary>
        /// Gets a single vendor by user name
        /// </summary>
        /// <param name="userName">Vendor's unique user name </param>
        /// <returns>Vendor</returns>
        [HttpGet("user")]
        public async Task<IActionResult> GetByUserName(string userName)
        {
            try
            {
                return new OkObjectResult(await _query.GetByUserName(userName));
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
        public async Task<IActionResult> InsertVendor([FromBody]Vendor vendor)
        {
            try
            {
                return new OkObjectResult(await _query.InsertVendor(vendor));
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
        [HttpPost("update")]
        public async Task<IActionResult> UpdateVendor([FromBody]Vendor vendor)
        {
            try
            {
                return new OkObjectResult(await _query.UpdateVendor(vendor));
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
        [HttpPost("remove")]
        public async Task<IActionResult> DeactivateVendor([FromBody]Vendor vendor)
        {
            try
            {
                return new OkObjectResult(await _query.DeactivateVendor(vendor));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }
    }

}