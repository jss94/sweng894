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
    public class VendorsControllerShould
    {
        // System Under Test
        readonly VendorsController _sut;

        readonly Mock<ILogger> _loggerMock;
        readonly Mock<IVendorsQuery> _vendorsQueryMock;
        readonly Mock<IAddressesQuery> _addressQueryMock;
        readonly Mock<VendorServices> _vendorServicesMock;
        
        public VendorsControllerShould()
        {
            _loggerMock = new Mock<ILogger>();
            _vendorsQueryMock = new Mock<IVendorsQuery>();
            _addressQueryMock = new Mock<IAddressesQuery>();
            _vendorServicesMock = new Mock<VendorServices>();

            _sut = new VendorsController(_vendorsQueryMock.Object, _addressQueryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public void GetAllVendors_ReturnsVendors()
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
            var task = _sut.GetAll();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Vendor>;
            Assert.Equal(usersResult[2].id, vendors[2].id);
            Assert.Equal(usersResult[0].services, vendors[0].services);
        }

        [Fact]
        public void GetVendorById_ReturnsVendorById()
        {
            // arrange
            var vendor = new Vendor { id = 123, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices{ vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue" };
            vendor.services = new List<VendorServices> { service };

            _vendorsQueryMock.Setup(x => x.GetById(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.GetById(vendor.id.Value);

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
            var service = new VendorServices{ vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue"
            };
            vendor.services = new List<VendorServices> { service };

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
            var service = new VendorServices{ vendorId = 123, flatFee = true, price = 20,
                serviceDescription = "desc", serviceName = "svcName", serviceType = "Venue"
            };
            vendor.services = new List<VendorServices> { service };

            _addressQueryMock.Setup(x => x.Insert(It.IsAny<Address>()))
                .Returns(Task.Factory.StartNew(() => 999));

            _vendorsQueryMock.Setup(x => x.Insert(vendor))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.Insert(vendor);

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

            _vendorsQueryMock.Setup(x => x.Update(vendor))
                .Returns(Task.Factory.StartNew(() => vendor));

            // act
            var task = _sut.Update(vendor);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Vendor;
            Assert.Equal(vendor, usersResult);
        }

        [Fact]
        public void DeactivateVendor_ReturnsTrue()
        {
            // arrange
            var vendor = new Vendor { id = 123 };

            _vendorsQueryMock.Setup(x => x.GetById(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => vendor));

            _vendorsQueryMock.Setup(x => x.Deactivate(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _sut.Deactivate(vendor.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }

        [Fact]
        public void DeleteVendor_ReturnsTrue()
        {
            // arrange
            var vendor = new Vendor { id = 123 };

            _vendorsQueryMock.Setup(x => x.Delete(vendor.id.Value))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _sut.Delete(vendor.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult.Value);
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

            _vendorsQueryMock.Setup(x => x.GetVendorsByServiceTypes("Venue"))
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
           
            _vendorsQueryMock.Setup(x => x.InsertService(service))
                .Returns(Task.Factory.StartNew(() => service));

            // act
            var task = _sut.InsertService(service);

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

            _vendorsQueryMock.Setup(x => x.UpdateService(service))
                .Returns(Task.Factory.StartNew(() => service));

            // act
            var task = _sut.UpdateService(service);

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
           
            _vendorsQueryMock.Setup(x => x.GetServicesByVendor(vendor.id.Value))
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

            _vendorsQueryMock.Setup(x => x.DeactivateService(service.id))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _sut.DeactivateService(service.id);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }
    }
}
