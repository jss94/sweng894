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

namespace UnitTests.Controllers
{
    public class ReservationsControllerShould
    {
        // System Under Test
        readonly ReservationsController _sut;

        readonly Mock<IReservationsQuery> _reservationsQueryMock;
        readonly Mock<IVendorsQuery> _vendorQueryMock;
        readonly Mock<ILogger> _loggerMock;
      
        public ReservationsControllerShould()
        {
            _reservationsQueryMock = new Mock<IReservationsQuery>();
            _loggerMock = new Mock<ILogger>();

            _sut = new ReservationsController(
               _reservationsQueryMock.Object,
               _loggerMock.Object);
        }

        [Fact]
        public void Get_ReturnsAllReservations()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = new List<Reservation> { reservation, reservation, reservation };

            //act
            _reservationsQueryMock.Setup(x => x.GetAll())
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = _sut.Get();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservation, usersResult.First());
        }

        [Fact]
        public void Get_ReturnsNotFound()
        {
            //arrange
            List<Reservation> reservations = null;

            //act
            _reservationsQueryMock.Setup(x => x.GetAll())
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = _sut.Get();

            // assert
            Assert.IsType<NotFoundResult>(task.Result);
        }

        [Fact]
        public void Get_ThrowsException()
        {
            //arrange
            var exception = new Exception();

            //act
            _reservationsQueryMock.Setup(x => x.GetAll())
            .Throws(exception);

            // assert
            Assert.ThrowsAsync<Exception>(() => _sut.Get());
        }

        [Fact]
        public void Insert_ReturnsReservation()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };

            //act
            _reservationsQueryMock.Setup(x => x.Insert(reservation))
            .Returns(Task.Factory.StartNew(() => reservation));

            var task = _sut.Insert(reservation);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Reservation;
            Assert.Equal(reservation, usersResult);
        }

        [Fact]
        public void Insert_ThrowsException()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };

            var exception = new Exception();

            //act
            _reservationsQueryMock.Setup(x => x.Insert(reservation))
            .Throws(exception);

            // assert
            Assert.ThrowsAsync<Exception>(() => _sut.Insert(reservation));
        }

        [Fact]
        public void Update_ReturnsReservation()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "Changed" };

            //act
            _reservationsQueryMock.Setup(x => x.Update(reservation))
            .Returns(Task.Factory.StartNew(() => reservation));

            var task = _sut.Update(reservation);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as Reservation;
            Assert.Equal(reservation, usersResult);
        }

        [Fact]
        public void Update_ThrowsException()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };

            var exception = new Exception();

            //act
            _reservationsQueryMock.Setup(x => x.Update(reservation))
            .Throws(exception);

            // assert
            Assert.ThrowsAsync<Exception>(() => _sut.Update(reservation));
        }

        [Fact]
        public void GetByVendor_ReturnsReservations()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = new List<Reservation> { reservation, reservation, reservation };
            int vendorId = 1;
            
            //act
            _reservationsQueryMock.Setup(x => x.GetByVendor(vendorId))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = _sut.GetByVendor(vendorId);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservation, usersResult.First());
        }

        [Fact]
        public void GetByVendor_ReturnsNotFound()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = null;
            int vendorId = 1;

            //act
            _reservationsQueryMock.Setup(x => x.GetByVendor(vendorId))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = _sut.GetByVendor(vendorId);

            // assert
            Assert.IsType<NotFoundResult>(task.Result);
        }

        [Fact]
        public void GetByVendor_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            int vendorId = 1;

            //act
            _reservationsQueryMock.Setup(x => x.GetByVendor(vendorId))
            .Throws(exception);

            // assert
            Assert.ThrowsAsync<Exception>(() => _sut.GetByVendor(vendorId));
        }

        [Fact]
        public void GetByUserName_ReturnsReservations()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = new List<Reservation> { reservation, reservation, reservation };
            string userName = "user@example.com";

            //act
            _reservationsQueryMock.Setup(x => x.GetByUserName(userName))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = _sut.GetByUser(userName);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<Reservation>;
            Assert.Equal(reservation, usersResult.First());
        }

        [Fact]
        public void GetByUserName_ReturnsNotFound()
        {
            //arrange
            var reservation = new Reservation { id = 1, eventId = 1, vendorId = 1, vendorServiceId = 1, status = "New" };
            List<Reservation> reservations = null;
            string userName = "user@example.com";

            //act
            _reservationsQueryMock.Setup(x => x.GetByUserName(userName))
            .Returns(Task.Factory.StartNew(() => reservations));

            var task = _sut.GetByUser(userName);

            // assert
            Assert.IsType<NotFoundResult>(task.Result);
        }

        [Fact]
        public void GetByUserName_ThrowsException()
        {
            //arrange
            var exception = new Exception();
            string userName = "user@example.com";

            //act
            _reservationsQueryMock.Setup(x => x.GetByUserName(userName))
            .Throws(exception);

            // assert
            Assert.ThrowsAsync<Exception>(() => _sut.GetByUser(userName));
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
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<string>;
            Assert.Equal(statusTypes, usersResult);
        }

    }
}
