using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using System;
using source.Database;
using source.Framework;

namespace UnitTests.Controllers
{
    public class FavoritesControllerShould
    {
        // System Under Test
        readonly FavoritesController _uut;

        readonly Mock<IFavoritesQuery> _favoritesQueryMock;
        readonly Mock<IVendorsQuery> _vendorsQueryMock;
        readonly Mock<ILogger> _loggerMock;

        public FavoritesControllerShould()
        {
            _favoritesQueryMock = new Mock<IFavoritesQuery>();
            _vendorsQueryMock = new Mock<IVendorsQuery>();
            _loggerMock = new Mock<ILogger>();

            _uut = new FavoritesController(
                _favoritesQueryMock.Object,
                _vendorsQueryMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public void GetFavoriteVendors_ReturnVendors()
        {
            //arrange

            Favorite fav1 = new Favorite() { userName = "aml5071", vendorId = 0 };
            Favorite fav2 = new Favorite() { userName = "aml5071", vendorId = 1 };
            Favorite fav3 = new Favorite() { userName = "aml5071", vendorId = 2 };
            var favorites = new List<Favorite> { fav1, fav2, fav3 };

            Vendor v1 = new Vendor() { id = 0, userName = "vendor0@example.com", name = "name0", website = "website_0" };
            Vendor v2 = new Vendor() { id = 1, userName = "vendor1@example.com", name = "name1", website = "website_1" };
            Vendor v3 = new Vendor() { id = 2, userName = "vendor2@example.com", name = "name2", website = "website_2" };
            var vendors = new List<Vendor> { v1, v2, v3 };


            _favoritesQueryMock.Setup(x => x.GetAllByUserName("aml5071"))
                .Returns(Task.Factory.StartNew(() => favorites));

            _vendorsQueryMock.Setup(x => x.GetById(It.IsAny<int>()))
                .Returns((int i) => Task.Factory.StartNew(() => vendors[i]));

            //act

            var task = _uut.GetFavoriteVendors("aml5071");

            //assert

            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var vendorsResult = result.Value as List<Vendor>;
            Assert.Equal(vendors, vendorsResult);
        }

        [Fact]
        public void GetFavoriteVendors_ReturnNotFound()
        {
            //arrange

            List<Favorite> favorites = null;

            _favoritesQueryMock.Setup(x => x.GetAllByUserName(It.IsAny<string>()))
                .Returns(Task.Factory.StartNew(() => favorites));

            //act

            var task = _uut.GetFavoriteVendors("aml5071");

            //assert

            Assert.IsType<NotFoundResult>(task.Result);
        }

        [Fact]
        public void IsFavorite_ReturnTrue()
        {
            //arrange

            _favoritesQueryMock.Setup(x => x.GetFavorite(It.IsAny<Favorite>()))
                .Returns((Favorite fav) => Task.Factory.StartNew(() => fav));

            //act

            var task = _uut.IsFavorite("aml5071", 10);

            //assert

            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var boolResult = result.Value as Boolean?;
            Assert.True(boolResult);
        }

        [Fact]
        public void IsFavorite_ReturnFalse()
        {
            //arrange

            Favorite fav = null;

            _favoritesQueryMock.Setup(x => x.GetFavorite(It.IsAny<Favorite>()))
                .Returns(Task.Factory.StartNew(() => fav));

            //act

            var task = _uut.IsFavorite("aml5071", 10);

            //assert

            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var boolResult = result.Value as Boolean?;
            Assert.False(boolResult);
        }

        [Fact]
        public void AddNewFavorite_ReturnSuccess()
        {
            //arrange

            Favorite newFav = new Favorite() {userName = "aml5071", vendorId = 10};

            _favoritesQueryMock.Setup(x => x.Add(It.IsAny<Favorite>()))
                .Returns((Favorite fav) => Task.Factory.StartNew(() => fav));

            //act

            var task = _uut.New(newFav);

            //assert

            Assert.IsType<CreatedAtActionResult>(task.Result);
            var result = task.Result as CreatedAtActionResult;
            Assert.True(result.StatusCode == 201);
            var favResult = result.Value as Favorite;
            Assert.Equal(newFav, favResult);            
        }

        [Fact]
        public void AddNewFavorite_ReturnFail()
        {
            //arrange
            Favorite fav = null;

            Favorite newFav = new Favorite() { userName = "aml5071", vendorId = 10 };

            _favoritesQueryMock.Setup(x => x.Add(It.IsAny<Favorite>()))
                .Returns(Task.Factory.StartNew(() => fav));

            //act

            var task = _uut.New(newFav);

            //assert

            Assert.IsType<BadRequestResult>(task.Result);
            var result = task.Result as BadRequestResult;
            Assert.Equal(400, result.StatusCode);

        }

        [Fact]
        public void RemoveFavorite_ReturnSuccess()
        {
            //arrange

            _favoritesQueryMock.Setup(x => x.Delete(It.IsAny<Favorite>()))
                .Returns(Task.Factory.StartNew(() => true));

            //act

            var task = _uut.Remove("aml5071", 10);

            //assert

            Assert.IsType<NoContentResult>(task.Result);
            var result = task.Result as NoContentResult;
            Assert.True(result.StatusCode == 204);

        }

        [Fact]
        public void RemoveFavorite_ReturnFail()
        {
            //arrange

            _favoritesQueryMock.Setup(x => x.Delete(It.IsAny<Favorite>()))
                .Returns(Task.Factory.StartNew(() => false));

            //act

            var task = _uut.Remove("aml5071", 10);

            //assert

            Assert.IsType<BadRequestResult>(task.Result);
            var result = task.Result as BadRequestResult;
            Assert.Equal(400, result.StatusCode);

        }
    }
}
