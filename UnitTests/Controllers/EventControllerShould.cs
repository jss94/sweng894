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
        //readonly Mock<AppDatabase> _mockDb;
        readonly Mock<EventDao> __eventDaoMock;
        readonly Mock<Event> _eventMock;


        public EventControllerShould()
        {
       //     _mockDb = new Mock<AppDatabase>();
            __eventDaoMock = new Mock<EventDao>();
            _eventMock = new Mock<Event>();

            _evntController = new EventController(__eventDaoMock.Object);

        }

        [Fact]
        public void CreateEventTest()
        {
            //Test setup of test is OK to this point. This can be removed once test is written
            Assert.Equal("test", "test");

            //TODO determine how to mock EventController get

            //TODO, mock out call to Create New Event.

        }
    }
}
