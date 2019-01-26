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
    public class EventControllerShould
    {
        // System Under Test
        readonly EventController _evntController;
        readonly Mock<IEventQuery> __eventDaoMock;
        readonly Mock<Event> _eventMock;


        public EventControllerShould()
        {
            __eventDaoMock = new Mock<IEventQuery>();

            _evntController = new EventController(__eventDaoMock.Object);
        }

        [Fact]
        public void GetAllEventsByUser_ReturnEvents()
        {

            //arrange
            var evt = new Event { eventId = 1, organizerId = "jss94", description= "event description!" };
            var evts = new List<Event> { evt, evt, evt };

            //act
            __eventDaoMock.Setup(x => x.GetAllEventsByUser("jss94"))
                .Returns(Task.Factory.StartNew(() => evts));

            var task = _evntController.Get("jss94");

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as List<Event>;
            Assert.Equal(eventsResult[2].description, evts[2].description);
            
        }
    }
}
