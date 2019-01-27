using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using System;

namespace UnitTests.Controllers
{
    public class VendorsControllerShould
    {
        // System Under Test
        readonly VendorsController _sut;

        readonly Mock<IVendorsQuery> _vendorsQueryMock;
        readonly Mock<Vendor> _vendorMock;


        public VendorsControllerShould()
        {
            _vendorsQueryMock = new Mock<IVendorsQuery>();
            _vendorMock = new Mock<Vendor>();

            _sut = new VendorsController(_vendorsQueryMock.Object);
        }

        [Fact]
        public void GetAllVendors_ReturnsVendors()
        {
            // arrange
            var vendor = new Vendor { guid = "123", name = "name1", description = "description1" };
            var vendors = new List<Vendor> { vendor, vendor, vendor };

            _vendorsQueryMock.Setup(x => x.GetAllAsync())
                .Returns(Task.Factory.StartNew(() => vendors));

            // act
            var task = _sut.GetAll();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Vendor>;
            Assert.Equal(usersResult[2].guid, vendors[2].guid);
        }
    }
}
