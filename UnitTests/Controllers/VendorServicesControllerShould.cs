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
using System;

namespace UnitTests.Controllers
{
    public class VendorServicesControllerShould
    {
        // System Under Test
        readonly VendorServicesController _sut;

        readonly Mock<ILogger> _loggerMock;
        readonly Mock<IVendorServicesQuery> _vendorServicesQueryMock;
        readonly Mock<VendorServices> _vendorServicesMock;

        public VendorServicesControllerShould()
        {
            _loggerMock = new Mock<ILogger>();
            _vendorServicesQueryMock = new Mock<IVendorServicesQuery>();
            _vendorServicesMock = new Mock<VendorServices>();

            _sut = new VendorServicesController(_vendorServicesQueryMock.Object,  _loggerMock.Object);
        }

        [Fact]
        public void GetVendorTypes_ReturnsServiceList()
        {
            // arrange
            var serviceTypesMock = new Mock<VendorServiceTypes>().Object;
            var serviceTypes = serviceTypesMock.GetVendorServiceTypes();

            // act
            var task = _sut.GetVendorServiceTypes();

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<string>;
            Assert.Equal(serviceTypes, usersResult);
        }

        [Fact]
        public async Task GetVendorsByService_ReturnsVendorsWithService()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices
            {
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };
            vendor.services = new List<VendorServices> { service };
            var vendors = new List<Vendor> { vendor, vendor, vendor };

            _vendorServicesQueryMock.Setup(x => x.GetVendorsByServiceTypes("Venue"))
                .Returns(Task.Factory.StartNew(() => vendors));

            // act
            var task = await _sut.GetVendorsByServiceType("Venue");

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<Vendor>;
            Assert.Equal(vendors[2].id, usersResult[2].id);
            Assert.Equal("Venue", usersResult[0].services.FirstOrDefault().serviceType);
        }

        [Fact]
        public async Task GetVendorsByService_ReturnsNotFound()
        {
            //arrange
            List<Vendor> vendors = null;

            _vendorServicesQueryMock.Setup(x => x.GetVendorsByServiceTypes("Venue"))
                .Returns(Task.Factory.StartNew(() => vendors));

            var task = await _sut.GetVendorsByServiceType("Venue");

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetVendorsByService_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorServicesQueryMock.Setup(x => x.GetVendorsByServiceTypes("Venue"))
            .Throws(exception);

            var task = await _sut.GetVendorsByServiceType("Venue");

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetAll_ReturnsVendorServices()
        {
            // arrange
            var service = new VendorServices
            {
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };

            List<VendorServices> services = new List<VendorServices>() { service, service, service };

            _vendorServicesQueryMock.Setup(x => x.GetAll())
                .Returns(Task.Factory.StartNew(() => services));

            // act
            var task = await _sut.Get();

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<VendorServices>;
            Assert.Equal(services, usersResult);
        }

        [Fact]
        public async Task Get_ReturnsNotFound()
        {
            //arrange
            List<VendorServices> services = null;

            _vendorServicesQueryMock.Setup(x => x.GetAll())
                .Returns(Task.Factory.StartNew(() => services));

            var task = await _sut.Get();

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task Get_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorServicesQueryMock.Setup(x => x.GetAll())
            .Throws(exception);

            var task = await _sut.Get();

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task InsertServiceType_ReturnsTrue()
        {
            // arrange
            var service = new VendorServices
            {
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };

            _vendorServicesQueryMock.Setup(x => x.InsertService(service))
                .Returns(Task.Factory.StartNew(() => service));

            // act
            var task = await _sut.Insert(service);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value;
            Assert.Equal(true, usersResult);
        }

        [Fact]
        public async Task InsertServiceType_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            VendorServices service = new VendorServices { serviceType = "Venue", serviceName = "Test" };

            //act
            _vendorServicesQueryMock.Setup(x => x.InsertService(service))
            .Throws(exception);

            var task = await _sut.Insert(service);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }


        [Fact]
        public async Task UpdateServiceType_ReturnsUpdatedServiceType()
        {
            // arrange
            var service = new VendorServices
            {
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };

            _vendorServicesQueryMock.Setup(x => x.UpdateService(service))
                .Returns(Task.Factory.StartNew(() => service));

            // act
            var task = await _sut.Update(service);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as VendorServices;
            Assert.Equal(service, usersResult);
        }

        [Fact]
        public async Task UpdateServiceType_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            VendorServices service = new VendorServices { serviceType = "Venue", serviceName = "Test" };

            //act
            _vendorServicesQueryMock.Setup(x => x.UpdateService(service))
            .Throws(exception);

            var task = await _sut.Update(service);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetServicesByVendor_ReturnsServicesOfVendor()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices
            {
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };
            vendor.services = new List<VendorServices> { service };

            _vendorServicesQueryMock.Setup(x => x.GetServicesByVendor(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => vendor.services));

            // act
            var task = await _sut.GetServicesByVendor(vendor.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<VendorServices>;
            Assert.Equal(vendor.services, usersResult);
        }

        [Fact]
        public async Task GetServicesByVendor_ReturnsNotFound()
        {
            //arrange
            List<VendorServices> services = null;

            _vendorServicesQueryMock.Setup(x => x.GetServicesByVendor(1))
                .Returns(Task.Factory.StartNew(() => services));

            var task = await _sut.GetServicesByVendor(1);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetServicesByVendor_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorServicesQueryMock.Setup(x => x.GetServicesByVendor(1))
            .Throws(exception);

            var task = await _sut.GetServicesByVendor(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task DeactivateService_ReturnsTrue()
        {
            // arrange
            var service = new VendorServices { id = 123 };

            _vendorServicesQueryMock.Setup(x => x.DeactivateByServiceId(It.IsAny<int>()))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = await _sut.Delete(service.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }

        [Fact]
        public async Task DeactivateService_ReturnsNotFound()
        {
            //arrange
            _vendorServicesQueryMock.Setup(x => x.DeactivateByServiceId(1))
                .Returns(Task.Factory.StartNew(() => false));

            var task = await _sut.Delete(1);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task DeactivateService_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorServicesQueryMock.Setup(x => x.DeactivateByServiceId(1))
            .Throws(exception);

            var task = await _sut.Delete(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetById_ReturnsVendorService()
        {
            // arrange
            var service = new VendorServices
            {
                id = 1,
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };

            _vendorServicesQueryMock.Setup(x => x.GetById(1))
                .Returns(Task.Factory.StartNew(() => service));

            // act
            var task = await _sut.GetServiceById(1);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as VendorServices;
            Assert.Equal(service, usersResult);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound()
        {
            //arrange
            VendorServices service = null;

            _vendorServicesQueryMock.Setup(x => x.GetById(1))
                .Returns(Task.Factory.StartNew(() => service));

            var task = await _sut.GetServiceById(1);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetById_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _vendorServicesQueryMock.Setup(x => x.GetById(1))
            .Throws(exception);

            var task = await _sut.GetServiceById(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task Search_ReturnsServices()
        {
            // arrange
            var vendorSearchProp = new VendorSearchProperties { type = "Venue", maxPrice = 100 };
            var service = new VendorServices
            {
                vendorId = 123,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };
            List<VendorServices> services = new List<VendorServices> { service, service };

            _vendorServicesQueryMock.Setup(x => x.Search(vendorSearchProp))
                .Returns(Task.Factory.StartNew(() => services));

            // act
            var task = await _sut.Search(vendorSearchProp);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<VendorServices>;
            Assert.Equal(services, usersResult);
        }

        [Fact]
        public async Task Search_ReturnsNotFound()
        {
            //arrange
            List<VendorServices> services = null;

            var vendorSearchProp = new VendorSearchProperties { type = "Venue", maxPrice = 100 };

            _vendorServicesQueryMock.Setup(x => x.Search(vendorSearchProp))
                .Returns(Task.Factory.StartNew(() => services));

            var task = await _sut.Search(vendorSearchProp);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task Search_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            var vendorSearchProp = new VendorSearchProperties { type = "Venue", maxPrice = 100 };

            //act
            _vendorServicesQueryMock.Setup(x => x.Search(vendorSearchProp))
            .Throws(exception);

            var task = await _sut.Search(vendorSearchProp);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }
    }
}
