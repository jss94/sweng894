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
    public class UsersControllerShould
    {
        // System Under Test
        readonly UsersController _sut;
        readonly Mock<IUsersQuery> _usersQueryMock;
        readonly Mock<IEventQuery> _eventQueryMock;
        readonly Mock<IVendorsQuery> _vendorsQueryMock;
        readonly Mock<IAddressesQuery> _addressQueryMock;
        readonly Mock<IVendorServicesQuery> _serviceQueryMock;
        readonly Mock<IGuestQuery> _guestQueryMock;


        public UsersControllerShould()
        {
            _usersQueryMock = new Mock<IUsersQuery>();
            _addressQueryMock = new Mock<IAddressesQuery>();
            _eventQueryMock = new Mock<IEventQuery>();
            _vendorsQueryMock = new Mock<IVendorsQuery>();
            _serviceQueryMock = new Mock<IVendorServicesQuery>();
            _guestQueryMock = new Mock<IGuestQuery>();


            _sut = new UsersController(
                _usersQueryMock.Object, 
                _vendorsQueryMock.Object,
                _eventQueryMock.Object,
                _guestQueryMock.Object,
                _addressQueryMock.Object,
                _serviceQueryMock.Object);
        }

        [Fact]
        public void GetAllUser_ReturnsUsers()
        {
            // arrange
            var user = new User 
            { 
                userName = "id1", 
                name = "name1", 
                role = "role1",
            };
            var users = new List<User> { user, user, user };

            _usersQueryMock.Setup(x => x.GetAll())
                .Returns(Task.Factory.StartNew(() => users));

            // act
            var task = _sut.GetAll();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<User>;
            Assert.Equal(users[2].userName, usersResult[2].userName);
        }

        [Fact]
        public void GetUser_ReturnsUser()
        {
            // arrange
            var user = new User
            {
                userName = "id1",
                name = "name1",
                role = "role1",
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName, true))
                .Returns(Task.Factory.StartNew(() => user));

            // act
            var task = _sut.GetUser(user.userName);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as User;
            Assert.Equal(user.name, usersResult.name);
        }

        [Fact]
        public void GetUser_ReturnsNotFound()
        {
            // arrange
            var user = new User
            {
                userName = "id1",
                name = "name1",
                role = "role1",
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName, true))
                .Returns(Task.Factory.StartNew(() => (User)null));

            // act
            var task = _sut.GetUser(user.userName);

            // assert
            Assert.IsType<NotFoundResult>(task.Result);
        }

        [Fact]
        public void Post_InsertsUser()
        {
            // arrange
            var user = new User
            {
                userName = "id1",
                name = "name1",
                role = "role1",
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName, true))
            .Returns(Task.Factory.StartNew(() => null as User));

            _usersQueryMock.Setup(x => x.Insert(user))
            .Returns(Task.Factory.StartNew(() => 0));

            // act
            var task = _sut.Post(user);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var userResult = result.Value as bool?;
            Assert.True(userResult);
        }


        [Fact]
        public void Put_UpdateExistingUser()
        {
            // arrange
            var user = new User
            {
                userName = "id1",
                name = "name1",
                role = "role1",
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName, true))
            .Returns(Task.Factory.StartNew(() => user));

            _usersQueryMock.Setup(x => x.Update(user))
            .Returns(Task.Factory.StartNew(() => (object)null));
                
            // act
            var task = _sut.Put(user);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            Assert.Equal(true, result.Value);
        }


        [Fact]
        public void Put_ReturnsNotFound()
        {
            // arrange
            var user = new User
            {
                userName = "id1",
                name = "name1",
                role = "role1",
            };

            _usersQueryMock.Setup(x => x.Update(user))
            .Returns(Task.Factory.StartNew(() => 55));

            _addressQueryMock.Setup(x => x.Update(It.IsAny<Address>()))
            .Returns(Task.Factory.StartNew(() => 99));

            // act
            var task = _sut.Put(user);

            // assert
            Assert.IsType<NotFoundResult>(task.Result);
        }
    }
}
