using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using System;

namespace UnitTests.Controllers
{
    public class EventControllerShould
    {
        // System Under Test
        readonly EventController _sut;

        readonly Mock<EventDao> __eventDaoMock;
        readonly Mock<Event> _eventMock;


        public EventControllerShould()
        {
          
        }

        [Fact]
        public void CreateEventTest()
        {
            Assert.Equal("test", "test");
            //throw new NotImplementedException();
        }
    }
}
