using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using source.Controllers;
using source.Models;
using source.Framework;
using System.Net;

namespace UnitTests.Controllers
{
    public class InvitationControllerShould
    {
        // System Under Test
        readonly InvitationController _invitationController;
        readonly Mock<IInvitationQuery> __invitationQueryMock;
        readonly Mock<ILogger> _loggerMock;

        public InvitationControllerShould()
        {
            __invitationQueryMock = new Mock<IInvitationQuery>();
            _loggerMock = new Mock<ILogger>();
            _invitationController = new InvitationController(__invitationQueryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public void getInvitation_ReturnInvitation()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.getInvitation(123))
                .Returns(Task.Factory.StartNew(() => invitation));

            var task = _invitationController.getInvitation(123);

            // assert
            Assert.IsType<Invitation>(task.Result);

            var result = task.Result as Invitation;
            Assert.Equal(1, invitation.invitationId);
            Assert.Equal(123, invitation.eventId);
            Assert.Equal("invitationContent!", invitation.content);
            Assert.Equal("invitationSubject", invitation.subject);

        }

        [Fact]
        public void postInvitation_Return200()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.saveInvitation(invitation))
                .Returns(Task.Factory.StartNew(() => true));

            var task = _invitationController.postInvitation(invitation);

            // assert
            Assert.IsType<HttpStatusCode>(task.Result);
            Assert.Equal(HttpStatusCode.OK, task.Result);
        }

        [Fact]
        public void updateInvitation_Return200()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.updateInvitation(invitation))
                .Returns(Task.Factory.StartNew(() => true));

            var task = _invitationController.putInvitation(invitation);

            // assert
            Assert.IsType<HttpStatusCode>(task.Result);
            Assert.Equal(HttpStatusCode.OK, task.Result);
        }

        [Fact]
        public void deleteInvitation_Return200()
        {
            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.deleteInvitation(123))
                .Returns(Task.Factory.StartNew(() => true));

            var task = _invitationController.deleteInvitation(123);

            // assert
            Assert.IsType<HttpStatusCode>(task.Result);
            Assert.Equal(HttpStatusCode.OK, task.Result);
        }
    }
}
