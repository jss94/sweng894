using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using source.Framework;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    /// <summary>
    /// Event controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class VendorEventsController : ControllerBase
    {

        IVendorEventsQuery _metricsQuery { get; set; }
        ILogger _logger { get; set; }


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IVendorEventsQuery object handled by dependency injection</param>
        public VendorEventsController(IVendorEventsQuery query)
        {
            _metricsQuery = query;
        }

        /// <summary>
        /// Returns a List of VendorEvents objects for the given Vendor Id
        /// </summary>
        /// <param name="vendorId">The vendorId.</param>
        [HttpGet("{vendorId}")]
        public async Task<IActionResult> GetVendorEvents(int vendorId)
        {
            try
            {
                var result = await _metricsQuery.GetVendorEvents(vendorId);
                if (result == null)
                    return new NotFoundResult();
                
                return new OkObjectResult(result);
            } catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return new NotFoundResult();
            }
            
        }
    }
}
