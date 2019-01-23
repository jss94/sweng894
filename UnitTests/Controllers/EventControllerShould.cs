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
            //_eventQueryMock = new Mock<IUsersQuery>();
            _eventMock = new Mock<Event>();

            _sut = new EventController(__eventDaoMock.Object);
        }

        [Fact]
        public void CreateEventTest()
        {
            throw new NotImplementedException();
        }
    }
}
