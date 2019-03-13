using System;
using System.Collections.Generic;
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
        private ILogger _logger;
        private IFavoritesQuery _favoritesQuery;
        private IVendorsQuery _vendorsQuery;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:source.Controllers.FavoritesController"/> class.
        /// </summary>
        /// <param name="favoritesQuery">Favorite Vendors query.</param>
        /// <param name="vendorQuery">Vendor query.</param>
        /// <param name="logger">Logger.</param>
        public FavoritesController(
            IFavoritesQuery favoritesQuery,
            IVendorsQuery vendorQuery,
            ILogger logger)
        {
            _favoritesQuery = favoritesQuery;
            _vendorsQuery = vendorQuery;
            _logger = logger;
        }

        /// <summary>
        /// Remove a favorite vendor from a user specific list of favorite vendors
        /// </summary>
        /// <returns>Status code 204 or 404</returns>
        /// <param name="userName">User's user name.</param>
        /// <param name="vendorId">Vendor ID.</param>
        [HttpDelete("{userName}/{vendorId}")]
        public async Task<IActionResult> Remove(string userName, int vendorId)
        {
            Favorite fav = new Favorite
            {
                userName = userName,
                vendorId = vendorId
            };

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

        /// <summary>
        /// Add a favorite vendor to a user specific list of favorite vendors
        /// </summary>
        /// <returns>A copy of the newly added Favorite vendor</returns>
        /// <param name="fav">The new favorite vendor</param>
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

        /// <summary>
        /// Gets the user specific list of favorite vendors
        /// </summary>
        /// <returns>List of favorite vendorsr</returns>
        /// <param name="userName">User's user name</param>
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

        /// <summary>
        /// Determines whether a vendor is marked as a favorite
        /// </summary>
        /// <returns>True/False</returns>
        /// <param name="userName">User's user name</param>
        /// <param name="vendorId">Vendor Id</param>
        [HttpGet("{userName}/{vendorId}")]
        public async Task<IActionResult> IsFavorite(string userName, int vendorId)
        {
            Favorite fav = new Favorite
            {
                userName = userName,
                vendorId = vendorId
            };

            try
            {
                var result = await _favoritesQuery.GetFavorite(fav);

                if (result == null)
                    return new OkObjectResult(false);
                else
                    return new OkObjectResult(true);
            }
            catch (Exception ex)
            {
                await _logger.LogError(HttpContext.User, ex);
                return new BadRequestResult();
            }
        }
    }
}