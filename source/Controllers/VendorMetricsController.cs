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
    public class VendorMetricsController : ControllerBase
    {

        IVendorMetricsQuery _metricsQuery { get; set; }
        ILogger _logger { get; set; }


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IVendorMetricsQuery object handled by dependency injection</param>
        public VendorMetricsController(IVendorMetricsQuery query)
        {
            _metricsQuery = query;
        }

        /// <summary>
        /// Returns a List of MonthlyMetric objects for the given Vendor Id
        /// </summary>
        /// <param name="id">The vendorId.</param>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMonthlyReservationMetrics(int id)
        {
            try
            {
                var result = await _metricsQuery.GetMonthlyReservationMetricAsync(id);
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
