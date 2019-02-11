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
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<string>;
            Assert.Equal(serviceTypes, usersResult);
        }

        [Fact]
        public void GetVendorsByService_ReturnsVendorsWithService()
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
            var task = _sut.GetVendorsByServiceType("Venue");

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Vendor>;
            Assert.Equal(vendors[2].id, usersResult[2].id);
            Assert.Equal("Venue", usersResult[0].services.FirstOrDefault().serviceType);
        }

        [Fact]
        public void GetAll_ReturnsVendorServices()
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
            var task = _sut.Get();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<VendorServices>;
            Assert.Equal(services, usersResult);
        }

        [Fact]
        public void InsertServiceType_ReturnsNewServiceType()
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
            var task = _sut.Insert(service);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as VendorServices;
            Assert.Equal(service, usersResult);
        }

        [Fact]
        public void UpdateServiceType_ReturnsUpdatedServiceType()
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
            var task = _sut.Update(service);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as VendorServices;
            Assert.Equal(service, usersResult);
        }

        [Fact]
        public void GetServicesByVendor_ReturnsServicesOfVendor()
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
            var task = _sut.GetServicesByVendor(vendor.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<VendorServices>;
            Assert.Equal(vendor.services, usersResult);
        }

        [Fact]
        public void DeactivateService_ReturnsTrue()
        {
            // arrange
            var service = new VendorServices { id = 123 };

            _vendorServicesQueryMock.Setup(x => x.Deactivate(It.IsAny<int>()))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _sut.Delete(service.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }
    }
}
