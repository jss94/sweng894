using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Framework;
using source.Constants;
using System.Linq;
using Microsoft.CodeAnalysis;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace UnitTests.Controllers
{
    public class VendorsControllerShould
    {
        // System Under Test
        readonly VendorsController _sut;

        readonly Mock<ILogger> _loggerMock;
        readonly Mock<IVendorsQuery> _vendorsQueryMock;
        readonly Mock<IAddressesQuery> _addressQueryMock;
        readonly Mock<IEventQuery> _eventsQueryMock;
        readonly Mock<IGuestQuery> _guestQueryMock;
        readonly Mock<IVendorServicesQuery> _vendorServicesQueryMock;
        private ClaimsPrincipal _user;

        public VendorsControllerShould()
        {
            _loggerMock = new Mock<ILogger>();
            _vendorsQueryMock = new Mock<IVendorsQuery>();
            _addressQueryMock = new Mock<IAddressesQuery>();
            _vendorServicesQueryMock = new Mock<IVendorServicesQuery>();
            _eventsQueryMock = new Mock<IEventQuery>();
            _guestQueryMock = new Mock<IGuestQuery>();

            _user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                             new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            _sut = new VendorsController(
                _vendorsQueryMock.Object,
                _addressQueryMock.Object,
                _vendorServicesQueryMock.Object,
                _eventsQueryMock.Object,
                _guestQueryMock.Object,
                _loggerMock.Object);

            _sut.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = _user }
            };
        }

        [Fact]
        public async Task GetAllVendors_ReturnsVendors()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices { vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue" };
            vendor.services = new List<VendorServices> { service };
            var vendors = new List<Vendor> { vendor, vendor, vendor };

            _vendorsQueryMock.Setup(x => x.GetAll())
                .Returns(Task.Factory.StartNew(() => vendors));

            // act
            var task = await _sut.GetAll();

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<Vendor>;
            Assert.Equal(usersResult[2].id, vendors[2].id);
            Assert.Equal(usersResult[0].services, vendors[0].services);
        }

        [Fact]
        public async Task GetAll_ReturnsNotFound()
        {
            //arrange
            List<Vendor> vendors = null;

            _vendorsQueryMock.Setup(x => x.GetAll())
                .Returns(Task.Factory.StartNew(() => vendors));

            var task = await _sut.GetAll();

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetAll_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorsQueryMock.Setup(x => x.GetAll())
            .Throws(exception);

            var task = await _sut.GetAll();

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetVendorById_ReturnsVendorById()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices{ vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue" };
            vendor.services = new List<VendorServices> { service };

            _vendorsQueryMock.Setup(x => x.GetById(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = await _sut.GetById(vendor.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);            
        }

        [Fact]
        public async Task GetVendorById_ReturnsNotFound()
        {
            //arrange
            Vendor vendor = null;

            _vendorsQueryMock.Setup(x => x.GetById(1))
                .Returns(Task.Factory.StartNew(() => vendor));

            var task = await _sut.GetById(1);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetVendorById_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorsQueryMock.Setup(x => x.GetById(1))
            .Throws(exception);

            var task = await _sut.GetById(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetVendorByName_ReturnsVendorByUserName()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices{ vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue"
            };
            vendor.services = new List<VendorServices> { service };

            _vendorsQueryMock.Setup(x => x.GetByUserName(vendor.userName))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = await _sut.GetByUserName(vendor.userName);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public async Task GetVendorByName_ReturnsNotFound()
        {
            //arrange
            Vendor vendor = null;

            _vendorsQueryMock.Setup(x => x.GetByUserName("vendor@example.com"))
                .Returns(Task.Factory.StartNew(() => vendor));

            var task = await _sut.GetByUserName("vendor@example.com");

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetVendorByName_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorsQueryMock.Setup(x => x.GetByUserName("vendor@example.com"))
            .Throws(exception);

            var task = await _sut.GetByUserName("vendor@example.com");
            // assert
            Assert.IsType<BadRequestResult>(task);
        }
               
        [Fact]
        public async Task InsertVendor_ReturnsVendor()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices{ vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue"
            };
            vendor.services = new List<VendorServices> { service };

            _addressQueryMock.Setup(x => x.Insert(It.IsAny<Address>()))
                .Returns(Task.Factory.StartNew(() => 999));

            _vendorsQueryMock.Setup(x => x.Insert(vendor))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = await _sut.Insert(vendor);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public async Task InsertVendor_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };

            //act
            _vendorsQueryMock.Setup(x => x.Insert(vendor))
            .Throws(exception);

            var task = await _sut.Insert(vendor);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task UpdateVendor_ReturnsTrue()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var address = new Address { id = 456, userName = "vendor@example.com", street = "123 Main St", city = "State College", state = "PA", zip = 16803 };

            _vendorsQueryMock.Setup(x => x.Update(vendor))
                .Returns(Task.Factory.StartNew(() => vendor));

            _addressQueryMock.Setup(x => x.GetByUserName("vendor@example.com"))
                .Returns(Task.Factory.StartNew(() => address));

             _vendorsQueryMock.Setup(x => x.GetByUserName("vendor@example.com"))
                 .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = await _sut.Update(vendor);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            Assert.Equal(true, result.Value);
        }

        [Fact]
        public async Task Update_ReturnsNotFound()
        {
            //arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var address = new Address { id = 456, userName = "vendor@example.com", street = "123 Main St", city = "State College", state = "PA", zip = 16803 };

            Vendor unfoundVendor = null;
            Address unfoundAddress = null;

            _vendorsQueryMock.Setup(x => x.Update(vendor))
                .Returns(Task.Factory.StartNew(() => false));

            _addressQueryMock.Setup(x => x.GetByUserName("vendor@example.com"))
                .Returns(Task.Factory.StartNew(() => unfoundAddress));

            _vendorsQueryMock.Setup(x => x.GetByUserName("vendor@example.com"))
                .Returns(Task.Factory.StartNew(() => unfoundVendor));

            var task = await _sut.Update(vendor);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task UpdateVendor_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };

            //act
            _vendorsQueryMock.Setup(x => x.GetByUserName(It.IsAny<string>()))
            .Throws(exception);

            var task = await _sut.Update(vendor);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task DeactivateVendor_ReturnsTrue()
        {
            // arrange
            var vendor = new Vendor { id = 123 };

            _vendorsQueryMock.Setup(x => x.GetByUserName(It.IsAny<string>()))
                .Returns(Task.Factory.StartNew(() => vendor));

            _vendorsQueryMock.Setup(x => x.Deactivate(It.IsAny<string>()))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = await _sut.Deactivate("aUser");

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }

        [Fact]
        public async Task Deactivate_ReturnsNotFound()
        {
            //arrange
            _vendorsQueryMock.Setup(x => x.Deactivate("vendor@example.com"))
                .Returns(Task.Factory.StartNew(() => false));

            var task = await _sut.Deactivate("vendor@example.com");

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task Deactivate_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorsQueryMock
                .Setup(x => x.GetByUserName(It.IsAny<string>()))
                .Throws(exception);

            var task = await _sut.Deactivate("vendor@example.com");

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task DeleteVendor_ReturnsTrue()
        {
            // arrange
            var vendor = new Vendor { id = 123 };

            _vendorsQueryMock.Setup(x => x.Delete(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = await _sut.Delete(vendor.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult.Value);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound()
        {
            //arrange
            _vendorsQueryMock.Setup(x => x.Delete(1))
                .Returns(Task.Factory.StartNew(() => false));

            var task = await _sut.Delete(1);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task Delete_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorsQueryMock.Setup(x => x.Delete(1))
            .Throws(exception);

            var task = await _sut.Delete(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }



    }
}
