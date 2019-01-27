using System;
using source.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using source.Models;

namespace source.Controllers
{
    /// <summary>
    /// Vendor Controller
    /// </summary>
    [Route("api/[controller]")]
    public class VendorsController
    {
        private IVendorsQuery _query;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IVendorsQuery object handled by dependency injection</param>
        public VendorsController(IVendorsQuery query)
        {
            _query = query;
        }

        /// <summary>
        /// GET api/vendors
        /// Gets all vendors
        /// </summary>
        /// <returns>List of Vendor</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var vendors = await _query.GetAllAsync();
                return new OkObjectResult(await _query.GetAllAsync());
            }
            catch(Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// GET api/vendors/{id}
        /// Gets a vendor by the vendor id
        /// </summary>
        /// <param name="id">Vendor id</param>
        /// <returns>Vendor</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                return new OkObjectResult(await _query.GetById(id));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// <summary>
        /// GET api/vendors/{userName}
        /// Gets a single vendor by user name
        /// </summary>
        /// <param name="userName">Vendor's unique user name </param>
        /// <returns>Vendor</returns>
        [HttpGet("{userName}")]
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
        /// POST api/vendors
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
        /// POST api/vendors/update
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
        /// POST api/vendor/remove
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