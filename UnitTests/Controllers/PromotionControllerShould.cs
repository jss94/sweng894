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

namespace UnitTests.Controllers
{
    public class PromotionControllerShould
    {
        // System Under Test
        readonly PromotionController _promoController;
        readonly Mock<IVendorPromotionQuery> _promoQueryMock;

        public PromotionControllerShould()
        {
            _promoQueryMock = new Mock<IVendorPromotionQuery>();

            _promoController = new PromotionController(_promoQueryMock.Object);
        }

        [Fact]
        public async Task GetPromotionById_ReturnPromotion()
        {

            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };

            //act
            _promoQueryMock.Setup(x => x.GetPromotion(1))
                .Returns(Task.Factory.StartNew(() => promo));

            var task = await _promoController.Get(1);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var returnedPromotion = result.Value as Promotion;
            Assert.Equal(returnedPromotion.promotionId, promo.promotionId);
            Assert.Equal(returnedPromotion.vendorId, promo.vendorId);
            Assert.Equal(returnedPromotion.startDate, promo.startDate);
            Assert.Equal(returnedPromotion.endDate, promo.endDate);
            Assert.Equal(returnedPromotion.description, promo.description);
            
        }

        [Fact]
        public async Task GetPromotionById_ReturnNull()
        {

            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };

            //act
            _promoQueryMock.Setup(x => x.GetPromotion(1))
                .Returns(Task.Factory.StartNew(() => ReturnNullPromotion()));

            var task = await _promoController.Get(1);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        private Promotion ReturnNullPromotion()
        {
            return null;
        }


        [Fact]
        public async Task GetAll_ReturnPromotions()
        {
            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };
            var promo2 = new Promotion { promotionId = 2, vendorId = 2, startDate = "03/16/2019", endDate = "04/16/2019", description = "promotion description2!" };
            var promos = new List<Promotion> { promo, promo2};

            //act
            _promoQueryMock.Setup(x => x.GetPromotions(2))
                .Returns(Task.Factory.StartNew(() => promos));

            var task = await _promoController.GetAll(2);

            // assert
            Assert.IsType<OkObjectResult>(task);
            var result = task as OkObjectResult;
            var returnedPromotions = result.Value as List<Promotion>;
            Assert.True(returnedPromotions.ToArray().Length == 2);

        }

        [Fact]
        public async Task GetAll_ReturnNullPromotions()
        {
            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };
            var promo2 = new Promotion { promotionId = 2, vendorId = 2, startDate = "03/16/2019", endDate = "04/16/2019", description = "promotion description2!" };
            var promos = new List<Promotion> { promo, promo2 };

            //act
            _promoQueryMock.Setup(x => x.GetPromotions(2))
                .Returns(Task.Factory.StartNew(() => ReturnNullList()));

            var task = await _promoController.Get(2);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        private List<Promotion> ReturnNullList()
        {
            return null;
        }

       
        [Fact]
        public async Task CreateNewPromotion()
        {

            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };

            //act
            _promoQueryMock.Setup(x => x.CreatePromotion(promo))
                .Returns(Task.Factory.StartNew(() => promo));

            var task = await _promoController.Create(promo);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var promoResult = result.Value as bool?;
            Assert.True(promoResult);

        }

        [Fact]
        public async Task CreateNewPromotion_ReturnBadRequestResult()
        {

            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };

            //act
            _promoQueryMock.Setup(x => x.CreatePromotion(promo))
                .Returns(Task.Factory.StartNew(() => throw new Exception()));

            var task = await _promoController.Create(promo);

            // assert
            Assert.IsType<BadRequestResult>(task);

        }
        
        [Fact]
        public async Task DeletePromotion_ReturnPromotion()
        {
            //arrange
            var promo = new Promotion { promotionId = 1, vendorId = 2, startDate = "01/16/1984", endDate = "02/16/1984", description = "promotion description!" };

            _promoQueryMock.Setup(x => x.GetPromotion(1))
                .Returns(Task.Factory.StartNew(() => promo));

            _promoQueryMock.Setup(x => x.DeletePromotion(1))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = await _promoController.Delete(1);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }



    }
}
