﻿using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using source.Controllers;
using source.Models;
using source.Framework;
using System.Net;
using System;

namespace UnitTests.Controllers
{
    public class InvitationControllerShould
    {
        // System Under Test
        readonly InvitationController _invitationController;
        readonly Mock<IInvitationQuery> __invitationQueryMock;
        readonly Mock<IEventQuery> _eventQueryMock;
        readonly Mock<ILogger> _loggerMock;

        public InvitationControllerShould()
        {
            __invitationQueryMock = new Mock<IInvitationQuery>();
            _loggerMock = new Mock<ILogger>();
            _eventQueryMock = new Mock<IEventQuery>();
            _invitationController = new InvitationController(__invitationQueryMock.Object, _eventQueryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task getInvitation_ReturnInvitation()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject", eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac" };

            //act
            __invitationQueryMock.Setup(x => x.getInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac"))
                .Returns(Task.Factory.StartNew(() => invitation));

            var task = await _invitationController.getInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac");

            // assert
            Assert.IsType<Invitation>(task);

            var result = task as Invitation;
            Assert.Equal(1, invitation.invitationId);
            Assert.Equal(123, invitation.eventId);
            Assert.Equal("invitationContent!", invitation.content);
            Assert.Equal("invitationSubject", invitation.subject);

        }

        [Fact]
        public async Task getInvitation_ReturnNullInvitation()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject", eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac" };

            //act
            __invitationQueryMock.Setup(x => x.getInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac"))
                .Returns(Task.Factory.StartNew(() => ThrowExceptionForGet()));

            var task = await _invitationController.getInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac");
            
            var result = task as Invitation;
            Assert.Null(result);
        }

        [Fact]
        public async Task postInvitation_Return200()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject", eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac" };
            var evnt = new Event
            {
                guid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac",
                eventId = 123,
                name = "Surprise Party",
                description = "Lets throw a surprise party for John!"
            };

            //act
            __invitationQueryMock.Setup(x => x.saveInvitation(invitation))
                .Returns(Task.Factory.StartNew(() => true));

            _eventQueryMock.Setup(x => x.GetEventByGuid("250c4e21-cf5d-4b5f-bf79-f11978bb18ac"))
                .Returns(Task.Factory.StartNew(() => evnt));

            var task = await _invitationController.postInvitation(invitation);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.OK, task);
        }

        [Fact]
        public async Task postInvitation_Return400FromException()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.saveInvitation(invitation))
                .Returns(Task.Factory.StartNew(() => ThrowException() ));

            var task = await _invitationController.postInvitation(invitation);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.BadRequest, task);
        }
        
        private bool ThrowException()
        {
            throw new Exception("Error occurred!");
        }

        private Invitation ThrowExceptionForGet()
        {
            throw new Exception("Error occurred!");
        }

        [Fact]
        public async Task updateInvitation_Return200()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.updateInvitation(invitation))
                .Returns(Task.Factory.StartNew(() => true));

            var task = await _invitationController.putInvitation(invitation);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.OK, task);
        }

        [Fact]
        public async Task updateInvitation_Return400()
        {

            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject" };

            //act
            __invitationQueryMock.Setup(x => x.updateInvitation(invitation))
                .Returns(Task.Factory.StartNew(() => ThrowException()));

            var task = await _invitationController.putInvitation(invitation);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.BadRequest, task);
        }

        [Fact]
        public async Task deleteInvitation_Return200()
        {
            //arrange
            var invitation = new Invitation { invitationId = 1, eventId = 123, content = "invitationContent!", subject = "invitationSubject",  eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac" };

            //act
            __invitationQueryMock.Setup(x => x.deleteInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac"))
                .Returns(Task.Factory.StartNew(() => true));

            var task = await _invitationController.deleteInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac");

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.OK, task);
        }

        [Fact]
        public async Task deleteInvitation_Return400()
        {
            //act
            __invitationQueryMock.Setup(x => x.deleteInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac"))
                .Returns(Task.Factory.StartNew(() => ThrowException()));

            var task = await _invitationController.deleteInvitation("250c4e21-cf5d-4b5f-bf79-f11978bb18ac");

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.BadRequest, task);
        }
    }
}
