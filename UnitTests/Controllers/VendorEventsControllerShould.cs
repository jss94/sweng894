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
    public class VendorEventsControllerShould
    {
        // System Under Test
        readonly VendorEventsController _vendorEventsController;
        readonly Mock<IVendorEventsQuery> __queryMock;

        public VendorEventsControllerShould()
        {
            __queryMock = new Mock<IVendorEventsQuery>();

            _vendorEventsController = new VendorEventsController(__queryMock.Object);
        }

        [Fact]
        public async Task GetVendorEvents_ReturnVendorEvents()
        {
            //arrange
            var vendorEvent = new VendorEvent { eventDate = "March-31-2019", serviceName = "Unit Test Name", serviceType = "Mock Service Type" };
            var vendorEvents = new List<VendorEvent> { vendorEvent };


            //act
            __queryMock.Setup(x => x.GetVendorEvents(5))
                .Returns(Task.Factory.StartNew(() => vendorEvents));

            var task = await _vendorEventsController.GetVendorEvents(5);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var results = result.Value as List<VendorEvent>;
            Assert.Equal("March-31-2019", results[0].eventDate);
            Assert.Equal("Unit Test Name", results[0].serviceName);
            Assert.Equal("Mock Service Type", results[0].serviceType);
        }
    }
}
