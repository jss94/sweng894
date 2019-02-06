using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;

namespace UnitTests.Controllers
{
    public class UsersControllerShould
    {
        // System Under Test
        readonly UsersController _sut;
        readonly Mock<IUsersQuery> _usersQueryMock;
        readonly Mock<IAddressesQuery> _addressQueryMock;

        public UsersControllerShould()
        {
            _usersQueryMock = new Mock<IUsersQuery>();
            _addressQueryMock = new Mock<IAddressesQuery>();
            _sut = new UsersController(_usersQueryMock.Object, _addressQueryMock.Object);
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
                address = new Address()
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
                address = new Address()
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName))
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
                address = new Address()
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName))
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
                address = new Address
                {
                    street = "test st",
                    city = "City of Testers",
                    state = "PA",
                    zip = 10001
                }
            };

            _usersQueryMock.Setup(x => x.Insert(user))
            .Returns(Task.Factory.StartNew(() => 55));

            _addressQueryMock.Setup(x => x.Insert(It.IsAny<Address>()))
            .Returns(Task.Factory.StartNew(() => 99));

            // act
            var task = _sut.Post(user);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var userResult = result.Value as User;
            Assert.Equal(99, user.addressId);
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
                addressId = 99,
                address = new Address
                {
                    street = "test st",
                    city = "City of Testers",
                    state = "PA",
                    zip = 10000
                }
            };

            _usersQueryMock.Setup(x => x.GetByUserName(user.userName))
            .Returns(Task.Factory.StartNew(() => user));

            _usersQueryMock.Setup(x => x.Update(user))
            .Returns(Task.Factory.StartNew(() => (object)null));

            _addressQueryMock.Setup(x => x.Update(It.IsAny<Address>()))
            .Returns(Task.Factory.StartNew(() => (object)null));

            // act
            var task = _sut.Put(user);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var userResult = result.Value as User;
            Assert.Equal(99, userResult.addressId);
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
                address = new Address
                {
                    street = "test st",
                    city = "City of Testers",
                    state = "PA",
                    zip = 10000
                }
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
