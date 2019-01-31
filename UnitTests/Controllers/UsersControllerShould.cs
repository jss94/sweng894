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
            Assert.Equal(usersResult[2].userName, users[2].userName);
        }
    }
}
