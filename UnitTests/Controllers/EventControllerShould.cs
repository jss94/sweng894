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
        readonly Mock<IEventQuery> __eventQueryMock;

        public EventControllerShould()
        {
            __eventQueryMock = new Mock<IEventQuery>();

            _evntController = new EventController(__eventQueryMock.Object);
        }

        [Fact]
        public async Task GetAllEventsByUser_ReturnEvents()
        {

            //arrange
            var evt1 = new Event { eventId = 1, userName = "jss94", description = "event description!" };
            var evt2 = new Event { eventId = 2, userName = "jss94", description = "event description two!" };
            var evt3 = new Event { eventId = 3, userName = "jss94", description = "event description three!!" };
            var evts = new List<Event> { evt1, evt2, evt3 };

            //act
            __eventQueryMock.Setup(x => x.GetAllEventsByUser("jss94"))
                .Returns(Task.Factory.StartNew(() => evts));

            var task = await _evntController.Get("jss94");

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var eventsResult = result.Value as List<Event>;
            Assert.Equal(eventsResult[2].description, evts[2].description);
            Assert.Equal(eventsResult[2].userName, evts[2].userName);
            Assert.Equal(eventsResult[2].eventId, evts[2].eventId);

        }

        [Fact]
        public async Task GetAllEventsByUser_ReturnNotFoundResult()
        {
            //act
            __eventQueryMock.Setup(x => x.GetAllEventsByUser("jss94"))
                .Returns(Task.Factory.StartNew(() => ReturnNullList()));

            var task = await _evntController.Get("jss94");

            // assert
            Assert.IsType<NotFoundResult>(task);

        }

        private List<Event> ReturnNullList()
        {
            return null;
        }

        [Fact]
        public async Task GetOneEventById_ReturnOneEvent()
        {

            //arrange
            var evt2 = new Event { eventId = 2, userName = "jss94", description = "event description two!" };

            //act
            __eventQueryMock.Setup(x => x.GetEventById(2))
                .Returns(Task.Factory.StartNew(() => evt2));

            var task = await _evntController.Get("jss94", 2);
            
            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var eventsResult = result.Value as Event;
            Assert.Equal(evt2.description, eventsResult.description);
            
        }

        [Fact]
        public async Task GetEventByGuid_ReturnsOneEvent()
        {
            //arrange
            var guid = Guid.NewGuid().ToString();
            var e = new Event { eventId = 2, userName = "jss94", guid = guid };

            //act
            __eventQueryMock.Setup(x => x.GetEventByGuid(e.guid))
                .Returns(Task.Factory.StartNew(() => e));

            var task = await _evntController.Get(guid);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetEventByGuid_ReturnsNoEvent()
        {
            //arrange
            var guid = Guid.NewGuid().ToString();
            var e = new Event { eventId = 2, userName = "jss94", guid = guid };

            //act
            __eventQueryMock.Setup(x => x.GetEventById(2))
                .Returns(Task.Factory.StartNew(() => e));

            var task = await _evntController.Get("jss94", 2);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var eventsResult = result.Value as Event;
            Assert.Equal(e.description, eventsResult.description);
        }

        [Fact]
        public async Task GetOneEventById_ReturnNotFoundResult()
        {

            //act
            __eventQueryMock.Setup(x => x.GetEventById(2))
                .Returns(Task.Factory.StartNew(() => ReturnNull()));

            var task = await _evntController.Get("jss94", 2);

            // assert
            Assert.IsType<NotFoundResult>(task);

        }

        private Event ReturnNull()
        {
            return null;
        }

        [Fact]
        public async Task CreateNewEvent()
        {

            //arrange
            var evt2 = new Event { eventId = 0, userName = "jss94", description = "mock test data event" };

            //act
            __eventQueryMock.Setup(x => x.CreateEvent(evt2))
                .Returns(Task.Factory.StartNew(() => evt2));

            var task = await _evntController.Create(evt2);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var eventResult = result.Value as bool?;
            Assert.True(eventResult);

        }

        [Fact]
        public async Task CreateNewEvent_ReturnBadRequestResult()
        {

            //arrange
            var evt2 = new Event { eventId = 0, userName = "jss94", description = "mock test data event" };

            //act
            __eventQueryMock.Setup(x => x.CreateEvent(evt2))
                .Returns(Task.Factory.StartNew(() => throw new Exception()));

            var task = await _evntController.Create(evt2);

            // assert
            Assert.IsType<BadRequestResult>(task);

        }


        [Fact]
        public async Task UpdateEvent_ReturnsEvent()
        {
            // arrange
            var evnt = new Event { eventId = 123, name = "Surprise Party", description = "Lets throw a surprise party for John!" };

            __eventQueryMock.Setup(x => x.UpdateEvent(evnt))
                .Returns(Task.Factory.StartNew(() => evnt));

            // act
            var task = await _evntController.Update(evnt);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var eventResult = result.Value as Event;
            Assert.Equal(evnt, eventResult);
        }

        [Fact]
        public async Task DeleteEvent_ReturnEvent()
        {
            // arrange
            var evnt = new Event {
                guid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac",
                eventId = 123, 
                name = "Surprise Party", 
                description = "Lets throw a surprise party for John!"
                };
                
            __eventQueryMock.Setup(x => x.GetEventByGuid(evnt.guid))
                .Returns(Task.Factory.StartNew(() => evnt));

            __eventQueryMock.Setup(x => x.DeleteById(evnt.eventId))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = await _evntController.Delete(evnt.guid);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }



    }
}
