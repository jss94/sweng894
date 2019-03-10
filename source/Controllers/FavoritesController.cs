using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using source.Framework;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    /// <summary>
    /// Favorites Controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {

        /// <summary>
        /// logger utility
        /// </summary>
        private ILogger _logger;
        private IFavoritesQuery _favoritesQuery;
        private IVendorsQuery _vendorsQuery;

        /// <summary>
        /// Constructor
        /// </summary>
        public FavoritesController(
            IFavoritesQuery favoritesQuery,
            IVendorsQuery vendorQuery,
            ILogger logger)
        {
            _favoritesQuery = favoritesQuery;
            _vendorsQuery = vendorQuery;
            _logger = logger;
        }

        [HttpDelete]
        public async Task<IActionResult> Remove([FromBody]Favorite fav)
        {
            try
            {
                var deleted = await _favoritesQuery.Delete(fav);

                if (deleted)
                {
                    return new NoContentResult();
                }
                else
                {
                    return new BadRequestResult();
                }
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }

        [HttpPost]
        public async Task<IActionResult> New([FromBody]Favorite fav)
        {
            try
            {
                var retFav = await _favoritesQuery.Add(fav);
                if (retFav != null)
                {
                    return CreatedAtAction(nameof(GetFavoriteVendors), new { userName = retFav.userName }, retFav);
                }
                else
                {
                    return new BadRequestResult();
                }
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }

        }

        [HttpGet("{userName}")]
        public async Task<IActionResult> GetFavoriteVendors(string userName)
        {
            List<Vendor> favoriteVendors = new List<Vendor>();
            try
            {
                var result = await _favoritesQuery.GetAllByUserName(userName);

                // Does not include empty results
                if (result == null)
                    return new NotFoundResult();

                foreach (Favorite fav in result)
                {
                    var vendor = await _vendorsQuery.GetById(fav.vendorId);
                    if (vendor != null)
                    {
                        favoriteVendors.Add(vendor);
                    }                    
                }

                return new OkObjectResult(favoriteVendors);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }
    }
}