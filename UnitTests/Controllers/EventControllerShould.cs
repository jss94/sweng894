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
            var evt1 = new Event { eventId = 1, organizerUserName = "jss94", eventDescription = "event description!" };
            var evt2 = new Event { eventId = 2, organizerUserName = "jss94", eventDescription = "event description two!" };
            var evt3 = new Event { eventId = 3, organizerUserName = "jss94", eventDescription = "event description three!!" };
            var evts = new List<Event> { evt1, evt2, evt3 };

            //act
            __eventDaoMock.Setup(x => x.GetAllEventsByUser("jss94"))
                .Returns(Task.Factory.StartNew(() => evts));

            var task = _evntController.Get("jss94");

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as List<Event>;
            Assert.Equal(eventsResult[2].eventDescription, evts[2].eventDescription);
            Assert.Equal(eventsResult[2].organizerUserName, evts[2].organizerUserName);
            Assert.Equal(eventsResult[2].eventId, evts[2].eventId);

        }
    }
}
