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
        [HttpGet("reservations/monthly/{id}")]
        public async Task<IActionResult> GetMonthlyReservationMetrics(int id)
        {
            try
            {
                var result = await _metricsQuery.GetMonthlyReservationCountMetricAsync(id);
                if (result == null)
                    return new NotFoundResult();
                
                return new OkObjectResult(result);
            } catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return new NotFoundResult();
            }
            
        }

        /// <summary>
        /// Returns a List of WeeklyReservationCountMetric objects for the given Vendor Id
        /// </summary>
        /// <param name="id">The vendorId.</param>
        [HttpGet("reservations/weekday/{id}")]
        public async Task<IActionResult> GetWeeklyReservationCountMetrics(int id)
        {
            try
            {
                var result = await _metricsQuery.GetWeeklyReservationCountMetricAsync(id);
                if (result == null)
                    return new NotFoundResult();

                return new OkObjectResult(result);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return new NotFoundResult();
            }

        }

        /// <summary>
        /// Returns a List of WeeklyReservationCountMetric objects for the given Vendor Id
        /// </summary>
        /// <param name="id">The vendorId.</param>
        [HttpGet("reservations/sales/monthly/{id}")]
        public async Task<IActionResult> GetMonthlyReservationSalesMetrics(int id)
        {
            try
            {
                var result = await _metricsQuery.GetMonthlyReservationSalesMetricAsync(id);
                if (result == null)
                    return new NotFoundResult();

                return new OkObjectResult(result);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return new NotFoundResult();
            }

        }

    }
}
