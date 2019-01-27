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
        readonly Mock<User> _userMock;


        public UsersControllerShould()
        {
            _usersQueryMock = new Mock<IUsersQuery>();
            _userMock = new Mock<User>();

            _sut = new UsersController(_usersQueryMock.Object);
        }

        [Fact]
        public void GetAllUser_ReturnsUsers()
        {
            // arrange
            var user = new User { userName = "id1", lastName = "name1", role = "role1" };
            var users = new List<User> { user, user, user };

            _usersQueryMock.Setup(x => x.GetAllAsync())
                .Returns(Task.Factory.StartNew(() => users));

            // act
            var task = _sut.GetAll();

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as List<User>;
            Assert.Equal(usersResult[2].userName, users[2].userName);
        }
    }
}
