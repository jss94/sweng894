using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Framework;

namespace UnitTests.Controllers
{
    public class VendorsControllerShould
    {
        // System Under Test
        readonly VendorsController _sut;

        readonly Mock<IVendorsQuery> _vendorsQueryMock;
        readonly Mock<ILogger> _loggerMock;
        readonly Mock<Vendor> _vendorMock;


        public VendorsControllerShould()
        {
            _vendorsQueryMock = new Mock<IVendorsQuery>();
            _vendorMock = new Mock<Vendor>();

            _sut = new VendorsController(_vendorsQueryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public void GetAllVendors_ReturnsVendors()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var vendors = new List<Vendor> { vendor, vendor, vendor };

            _vendorsQueryMock.Setup(x => x.GetAllAsync())
                .Returns(Task.Factory.StartNew(() => vendors));

            // act
            var task = _sut.GetAll();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Vendor>;
            Assert.Equal(usersResult[2].id, vendors[2].id);
        }

        [Fact]
        public void GetVendorById_ReturnsVendorById()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            
            _vendorsQueryMock.Setup(x => x.GetById(vendor.id))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.GetById(vendor.id);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public void GetVendorByName_ReturnsVendorByUserName()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            
            _vendorsQueryMock.Setup(x => x.GetByUserName(vendor.userName))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.GetByUserName(vendor.userName);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public void InsertVendor_ReturnsVendor()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };

            _vendorsQueryMock.Setup(x => x.InsertVendor(vendor))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.InsertVendor(vendor);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public void UpdateVendor_ReturnsVendor()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };

            _vendorsQueryMock.Setup(x => x.UpdateVendor(vendor))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.UpdateVendor(vendor);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public void DeactivateVendor_ReturnsNull()
        {
            // arrange
            var vendor = new Vendor { id = 123 };
            
            _vendorsQueryMock.Setup(x => x.DeactivateVendor(vendor))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _sut.DeactivateVendor(vendor);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }



    }
}
