using Microsoft.AspNetCore.Mvc;
using Moq;
using source.Controllers;
using source.Models;
using source.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace UnitTests.Controllers
{
    public class GuestControllerShould
    {
        // System Under Test
        readonly GuestController _sut;

        readonly Mock<IGuestQuery> _guestQueryMock;
        readonly Mock<Guest> _guestMock;

        public GuestControllerShould()
        {
            _guestQueryMock = new Mock<IGuestQuery>();
            _guestMock = new Mock<Guest>();

            _sut = new GuestController(_guestQueryMock.Object);
        }

        [Fact]
        public void GetListByEventId_ReturnsGuestList()
        {
            // arrange
            List<Guest> guests = new List<Guest>();
            guests.Add(new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1 });
            guests.Add(new Guest { guestId = 124, name = "Guest2", email = "test2@psu.edu", isGoing = true, eventId = 1 });
            guests.Add(new Guest { guestId = 125, name = "Guest3", email = "test3@psu.edu", isGoing = false, eventId = 1 });
            guests.Add(new Guest { guestId = 126, name = "Guest4", email = "test4@psu.edu", isGoing = null, eventId = 1 });

            _guestQueryMock.Setup(x => x.GetListByEventId(guests.First().eventId))
                .Returns(Task.Factory.StartNew(() => guests));

            // act
            var task = _sut.GetListByEventId(guests.First().eventId);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var guestsResult = result.Value as List<Guest>;
            Assert.Equal(guests, guestsResult);
        }

        [Fact]
        public void GetGuestById_ReturnsGuest()
        {
            // arrange
            Guest guest = new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1 };

            _guestQueryMock.Setup(x => x.GetByGuestId(guest.guestId))
                .Returns(Task.Factory.StartNew(() => guest));

            // act
            var task = _sut.GetGuestById(guest.guestId);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var guestResult = result.Value as Guest;
            Assert.Equal(guest, guestResult);
        }

        [Fact]
        public void Insert_ReturnsGuest()
        {
            // arrange
            var guest = new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1 };

            _guestQueryMock.Setup(x => x.Insert(guest))
                .Returns(Task.Factory.StartNew(() => guest));

            // act
            var task = _sut.Insert(guest);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var guestResult = result.Value as bool?;
            Assert.True(guestResult);
        }

        [Fact]
        public void Update_ReturnsGuest()
        {
            // arrange
            var guest = new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1 };

            _guestQueryMock.Setup(x => x.Update(guest))
                .Returns(Task.Factory.StartNew(() => guest));

            // act
            var task = _sut.Update(guest);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var guestResult = result.Value as bool?;
            Assert.True(guestResult);
        }

        [Fact]
        public void Delete_ReturnsNull()
        {
            // arrange
            var guest = new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1 };

            _guestQueryMock.Setup(x => x.GetByGuestId(It.IsAny<int>()))
                .Returns(Task.Factory.StartNew(() => guest ));

            _guestQueryMock.Setup(x => x.DeleteByGuestId(It.IsAny<int>()))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _sut.DeleteByGuestId(0);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var guestResult = result.Value as bool?;
            Assert.True(guestResult);
        }
    }
}
