using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using source.Controllers;
using source.Models;
using source.Framework;
using System.Net;
using source.Models.Email;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System;
using source.Constants;
using Google.Protobuf.WellKnownTypes;
using System.Security.Claims;

namespace UnitTests.Controllers
{
    public class ReservationsControllerShould
    {
        // System Under Test
        readonly ReservationsController _sut;
        private readonly Mock<IReservationsQuery> _reservationsQueryMock;
        readonly Mock<ILogger> _loggerMock;
      
        public ReservationsControllerShould()
        {
            _reservationsQueryMock = new Mock<IReservationsQuery>();
            _loggerMock = new Mock<ILogger>();

            _sut = new ReservationsController(
               _reservationsQueryMock.Object,
               _loggerMock.Object);
        }

        private void ThrowException()
        {
            throw new Exception("Unknown error occurred");
        }

        [Fact]
        public async Task Get_ReturnsAllReservations()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = new List<Reservation> { reservation, reservation, reservation };

            //act
            _reservationsQueryMock.Setup(x => x.GetAll())
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.Get();

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservation, usersResult.First());
        }

        [Fact]
        public async Task Get_ReturnsNotFound()
        {
            //arrange
            List<Reservation> reservations = null;

            //act
            _reservationsQueryMock.Setup(x => x.GetAll())
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.Get();

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task Get_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _reservationsQueryMock.Setup(x => x.GetAll())
            .Throws(exception);

            var task = await _sut.Get();

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task Insert_ReturnsReservation()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };

            //act
            _reservationsQueryMock.Setup(x => x.Insert(reservation))
            .Returns(Task.Factory.StartNew(() => reservation));

            var task = await _sut.Insert(reservation);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as Reservation;
            Assert.Equal(reservation, usersResult);
        }

        [Fact]
        public async Task Insert_ThrowsException()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };

            var exception = new Exception();

            //act
            _reservationsQueryMock.Setup(x => x.Insert(reservation))
            .Throws(exception);

            var task = await _sut.Insert(reservation);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task Update_ReturnsReservation()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "Changed" };

            //act
            _reservationsQueryMock.Setup(x => x.Update(reservation))
            .Returns(Task.Factory.StartNew(() => reservation));

            var task = await _sut.Update(reservation);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as Reservation;
            Assert.Equal(reservation, usersResult);
        }

        [Fact]
        public async Task Update_ThrowsException()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };

            var exception = new Exception();

            //act
            _reservationsQueryMock.Setup(x => x.Update(reservation))
            .Throws(exception);

            var task = await _sut.Update(reservation);

            // assert
            Assert.IsType<BadRequestResult>(task);

        }

        [Fact]
        public async Task GetByVendor_ReturnsReservations()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = new List<Reservation> { reservation, reservation, reservation };
            int vendorId = 1;
            
            //act
            _reservationsQueryMock.Setup(x => x.GetByVendor(vendorId))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.GetByVendor(vendorId);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservation, usersResult.First());
        }

        [Fact]
        public async Task GetByVendor_ReturnsNotFound()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = null;
            int vendorId = 1;

            //act
            _reservationsQueryMock.Setup(x => x.GetByVendor(vendorId))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.GetByVendor(vendorId);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetByVendor_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            int vendorId = 1;

            //act
            _reservationsQueryMock.Setup(x => x.GetByVendor(vendorId))
            .Throws(exception);

            var task = await _sut.GetByVendor(vendorId);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetByUserName_ReturnsReservations()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = new List<Reservation> { reservation, reservation, reservation };
            string userName = "user@example.com";

            //act
            _reservationsQueryMock.Setup(x => x.GetByUserName(userName))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.GetByUser(userName);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservation, usersResult.First());
        }

        [Fact]
        public async Task GetByUserName_ReturnsNotFound()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = null;
            string userName = "user@example.com";

            //act
            _reservationsQueryMock.Setup(x => x.GetByUserName(userName))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.GetByUser(userName);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetByUserName_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            string userName = "user@example.com";

            //act
            _reservationsQueryMock.Setup(x => x.GetByUserName(userName))
            .Throws(exception);

            var task = await _sut.GetByUser(userName);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public void GetReservationStatusList_ReturnsStatusList()
        {
            // arrange
            var statusTypesMock = new Mock<ReservationStatus>().Object;
            var statusTypes = statusTypesMock.GetReservationStatuses();

            // act
            var task = _sut.GetReservationStatusTypes();

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<string>;
            Assert.Equal(statusTypes, usersResult);
        }

        [Fact]
        public async Task DeactivateReservation_ReturnsTrue()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };

            //act
            _reservationsQueryMock.Setup(x => x.Deactivate(reservation.id.Value))
                .Returns(Task.Factory.StartNew(() => true));

            var task = await _sut.Delete(reservation.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task);
            var result = task as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }

        [Fact]
        public async Task DeactivateService_ReturnsNotFound()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            
            //act
            _reservationsQueryMock.Setup(x => x.Deactivate(reservation.id.Value))
                .Returns(Task.Factory.StartNew(() => false));

            var task = await _sut.Delete(reservation.id.Value);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task DeactivateService_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _reservationsQueryMock
            .Setup(x => x.Deactivate(1))
            .Throws(exception);

            _loggerMock
            .Setup(x => x.LogError(It.IsAny<ClaimsPrincipal>(), It.IsAny<Exception>()))
            .Returns(Task.FromResult(default(object)));

            var task = await _sut.Delete(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetById_ReturnsReservation()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            
            //act
            _reservationsQueryMock.Setup(x => x.GetById(reservation.id.Value))
            .Returns(Task.Factory.StartNew(() => reservation));

            var task = await _sut.GetById(reservation.id.Value);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as Reservation;
            Assert.Equal(reservation, usersResult);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            Reservation returnedReservation = null;
            
            //act
            _reservationsQueryMock.Setup(x => x.GetById(reservation.id.Value))
            .Returns(Task.Factory.StartNew(() => returnedReservation));

            var task = await _sut.GetById(reservation.id.Value);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetById_ThrowsException()
        {
            //arrange
            var exception = new Exception();
      
            //act
            _reservationsQueryMock.Setup(x => x.GetById(1))
            .Throws(exception);

            var task = await _sut.GetById(1);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

        [Fact]
        public async Task GetByEventId_ReturnsReservationList()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            var reservations = new List<Reservation>() { reservation, reservation, reservation };
            var eventGuid = "1234-4568-9101-1213";

            //act
            _reservationsQueryMock.Setup(x => x.GetByEventId(eventGuid))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = await _sut.GetByEventId(eventGuid);

            // assert
            Assert.IsType<OkObjectResult>(task);

            var result = task as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservations, usersResult);
        }

        [Fact]
        public async Task GetByEventId_ReturnsNotFound()
        {
            //arrange
            var eventGuid = "1234-4568-9101-1213";
            List<Reservation> returnedReservations = null;

            //act
            _reservationsQueryMock.Setup(x => x.GetByEventId(eventGuid))
            .Returns(Task.Factory.StartNew(() => returnedReservations));

            var task = await _sut.GetByEventId(eventGuid);

            // assert
            Assert.IsType<NotFoundResult>(task);
        }

        [Fact]
        public async Task GetByEventId_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            var eventGuid = "1234-4568-9101-1213";

            //act
            _reservationsQueryMock.Setup(x => x.GetByEventId(eventGuid))
            .Throws(exception);

            var task = await _sut.GetByEventId(eventGuid);

            // assert
            Assert.IsType<BadRequestResult>(task);
        }

    }
}
