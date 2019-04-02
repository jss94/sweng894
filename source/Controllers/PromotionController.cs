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
    /// Promotion controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {

        IVendorPromotionQuery _promoQuery { get; set; }
        ILogger _logger { get; set; }


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IVendorPromotionQuery object handled by dependency injection</param>
        public PromotionController(IVendorPromotionQuery query)
        {
            _promoQuery = query;
        }

        /// <summary>
        /// Returns All Promotions for a given vendor id
        /// </summary>
        /// <param name="vendorId">The vendorId of which all promotions belong.</param>
        [HttpGet("vendor/{vendorId}")]
        public async Task<IActionResult> GetAll(int vendorId)
        {
            var result = await _promoQuery.GetPromotions(vendorId);
            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        /// <summary>
        /// Returns Promotion for a given promotion id
        /// </summary>
        /// <param name="promotionId">The promotionId.</param>
        [HttpGet("{promotionId}")]
        public async Task<IActionResult> Get(int promotionId)
        {
            var result = await _promoQuery.GetPromotion(promotionId);
            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        /// <summary>
        /// Creates a new promotion in the database
        /// </summary>
        /// <param name="promotion">The Promotion to insert into the database.</param>
        [HttpPost]
        public async Task<IActionResult>Create([FromBody]Promotion promotion)
        {
            try
            {
                await _promoQuery.CreatePromotion(promotion);
                return new OkObjectResult(true);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return new BadRequestResult();
            }

        }
        
        /// <summary>
        /// Deletes the promotion.
        /// </summary>
        /// <param name="promotionId">Promotion identifier.</param>
        [HttpDelete("{promotionId}")]
        public async Task<IActionResult> Delete(int promotionId)
        {
            var result = await _promoQuery.GetPromotion(promotionId);

            if (result == null)
                return new NotFoundResult();

            await _promoQuery.DeletePromotion(result.promotionId);
            return new OkObjectResult(true);
        }
    }
}
