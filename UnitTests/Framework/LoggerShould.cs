using Microsoft.AspNetCore.Mvc;
using Moq;
using source.Framework;
using source.Models;
using source.Queries;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace UnitTests.Framework
{
    public class LoggerShould
    {
        readonly Logger _sut;
        readonly Mock<ILoggerQuery> __loggerQueryMock;

        public LoggerShould()
        {
            __loggerQueryMock = new Mock<ILoggerQuery>();
            _sut = new Logger(__loggerQueryMock.Object);
        }

        [Fact]
        public void LogError_ReturnsNull()
        {
            var error = new VerboseError { source = "test", errorMessage = "error" };
            __loggerQueryMock.Setup(x => x.LogError(error))
               .Returns(Task.Factory.StartNew(() => true));

            var user = new System.Security.Claims.ClaimsPrincipal();
            var exception = new Exception();

            var task = _sut.LogError(user, exception);

            Assert.True(task.IsCompletedSuccessfully);
        }
    }
}
