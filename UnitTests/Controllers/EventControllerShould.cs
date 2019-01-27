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
            var evt1 = new Event { eventId = 1, organizerId = "jss94", description= "event description!" };
            var evt2 = new Event { eventId = 2, organizerId = "jss94", description = "event description two!" };
            var evt3 = new Event { eventId = 3, organizerId = "jss94", description = "event description three!!" };
            var evts = new List<Event> { evt1, evt2, evt3 };

            //act
            __eventDaoMock.Setup(x => x.GetAllEventsByUser("jss94"))
                .Returns(Task.Factory.StartNew(() => evts));

            var task = _evntController.Get("jss94");

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as List<Event>;
            Assert.Equal(eventsResult[2].description, evts[2].description);
            Assert.Equal(eventsResult[2].organizerId, evts[2].organizerId);
            Assert.Equal(eventsResult[2].eventId, evts[2].eventId);

        }

        [Fact]
        public void GetOneEventById_ReturnOneEvent()
        {

            //arrange
            var evt2 = new Event { eventId = 2, organizerId = "jss94", description = "event description two!" };

            //act
            __eventDaoMock.Setup(x => x.GetOneEventById(2))
                .Returns(Task.Factory.StartNew(() => evt2));

            var task = _evntController.Get("jss94", 2);
            
            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as Event;
            Assert.Equal(evt2.description, eventsResult.description);
            
        }

        [Fact]
        public void CreateNewEvent_Post()
        {

            //arrange
            var evt2 = new Event { eventId = 0, organizerId = "jss94", description = "mock test data event" };

            //act
            __eventDaoMock.Setup(x => x.CreateNewEvent(evt2))
                .Returns(Task.Factory.StartNew(() => evt2));

            var task = _evntController.Post(evt2);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as Event;
            Assert.Equal(evt2.description, eventsResult.description);

        }

    }
}
