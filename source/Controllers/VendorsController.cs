using System;
using source.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace source.Controllers
{
    [Route("api/[controller]")]
    public class VendorsController
    {
        private IVendorsQuery _query;

        public VendorsController(IVendorsQuery query)
        {
            _query = query;
        }

        /// GET api/vendors
        /// <summary>
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

        /// GET api/vendors/id
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
                return new OkObjectResult(await _query.GetById(id));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }

        /// GET api/vendors/username
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
                return new OkObjectResult(await _query.GetByUserName(userName));
            }
            catch (Exception ex)
            {
                //TODO: we should log our errors in the db

                return new BadRequestResult();
            }
        }
    }
}