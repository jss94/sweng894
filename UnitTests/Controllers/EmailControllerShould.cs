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
using System;
using Microsoft.AspNetCore.Mvc;

namespace UnitTests.Controllers
{
    public class EmailControllerShould
    {
        // System Under Test
        readonly Mock<IEmailQuery> _emailQueryMock;
        readonly Mock<IVendorsQuery> _vendorQueryMock;
        readonly Mock<IGuestQuery> _guestQueryMock;
        readonly Mock<ILogger> _loggerMock;
        readonly EmailController _emailController;
        readonly Mock<IInvitationQuery> _invitationQueryMock;
        readonly Mock<IReservationsQuery> _reservationQueryMock;
        readonly Mock<IVendorServicesQuery> _vendorServiceQueryMock;
        readonly Mock<HttpContext> _mockHttpContext;

        public EmailControllerShould()
        {
            _vendorQueryMock = new Mock<IVendorsQuery>();
            _guestQueryMock = new Mock<IGuestQuery>();
            _loggerMock = new Mock<ILogger>();
            _emailQueryMock = new Mock<IEmailQuery>();
            _invitationQueryMock = new Mock<IInvitationQuery>();
            _reservationQueryMock = new Mock<IReservationsQuery>();
            _vendorServiceQueryMock = new Mock<IVendorServicesQuery>();
            _mockHttpContext = new Mock<HttpContext>();
            _emailController = new EmailController(_vendorQueryMock.Object, _guestQueryMock.Object, _loggerMock.Object, _emailQueryMock.Object, _invitationQueryMock.Object, _reservationQueryMock.Object, _vendorServiceQueryMock.Object);
        }
        
        [Fact]
        public async Task PostQuestionToVendor_Return202()
        {

            //arrange
            var vendor = new Vendor { id = 123, userName = "unitTest@email.com", name = "name1", website = "website_1" };
            var emailMsg = new EmailMessage();

            emailMsg.from = new source.Models.Email.EmailRecipient("unit@testEmail.com");
            emailMsg.subject = "Unit Test";
            
            List<EmailPersonalization> personalizations = new List<EmailPersonalization>();
            EmailPersonalization personalization = new EmailPersonalization();
            personalization.to.Add((new EmailRecipient("unitTest@email.com")));
            personalizations.Add(personalization);
            emailMsg.personalizations = personalizations;

            List<EmailContent> contents = new List<EmailContent>();
            contents.Add(new EmailContent("text/plain", "unit content"));
            emailMsg.content = contents;

            //act
            _vendorQueryMock.Setup(x => x.GetById(123))
            .Returns(Task.Factory.StartNew(() => vendor));
            
            _emailQueryMock.Setup(x => x.sendEmailViaPostAsync(emailMsg))
            .Returns(Task.Factory.StartNew(() => HttpStatusCode.Accepted));
            
            var task = await _emailController.PostQuestionToVendor(123, emailMsg);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            
            Assert.True(task.Equals(HttpStatusCode.Accepted));
        }

        [Fact]
        public async Task PostQuestionToVendor_Return404()
        {
            //arrange
            var emailMsg = new EmailMessage();
            
            //act
            _vendorQueryMock.Setup(x => x.GetById(123))
            .Returns(Task.Factory.StartNew(() => ReturnNullVendor()));
            
            var task = await _emailController.PostQuestionToVendor(123, emailMsg);

            // assert
            Assert.IsType<HttpStatusCode>(task);

            Assert.True(task.Equals(HttpStatusCode.NotFound));
        }

        private Vendor ReturnNullVendor()
        {
            return null;
        }

        private List<Guest> ReturnNullGuestList()
        {
            return null;
        }

        [Fact]
        public async Task PostEventInviteToGuests_Return202()
        {
            List<Guest> guests = new List<Guest>();
            guests.Add(new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1, eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac"});
            guests.Add(new Guest { guestId = 124, name = "Guest2", email = "test2@psu.edu", isGoing = true, eventId = 1, eventGuid = "3550c4e31-cf5d-4b5f-bf79-f11978bb18ac" });


            string eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac";

            var emailMsg = new EmailMessage();

            emailMsg.from = new source.Models.Email.EmailRecipient("unit@testEmail.com");
            emailMsg.subject = "Unit Test";

            List<EmailPersonalization> personalizations = new List<EmailPersonalization>();
            EmailPersonalization personalization = new EmailPersonalization();
            personalization.to.Add((new EmailRecipient("unitTest@email.com")));
            personalizations.Add(personalization);
            emailMsg.personalizations = personalizations;

            List<EmailContent> contents = new List<EmailContent>();
            contents.Add(new EmailContent("text/plain", "unit content"));
            emailMsg.content = contents;

            _invitationQueryMock.Setup(x => x.updateInvitationContentToIncludeRSVP(It.IsAny<Guest>(), It.IsAny<EmailContent>(), It.IsAny<HttpContext>()))
                .Returns(new EmailContent("text/html", "mocked content"));

            _guestQueryMock.Setup(x => x.GetListByEventGuid(guests[0].eventGuid))
                .Returns(Task.Factory.StartNew(() => guests));

            _emailQueryMock.Setup(x => x.sendEmailViaPostAsync(emailMsg))
            .Returns(Task.Factory.StartNew(() => HttpStatusCode.Accepted));

            _emailQueryMock.Setup(x => x.getBaseUrlForEmail(It.IsAny<HttpContext>()))
                .Returns("https://fakeUrl.com");

            var task = await _emailController.PostEventInviteToGuests(eventGuid, emailMsg);
            
            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.Accepted, task);
        }

        [Fact]
        public async Task PostEventInviteToGuests_Return404EmptyList()
        {
            List<Guest> guests = new List<Guest>();
            string eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac";

            var emailMsg = new EmailMessage();
            
            _guestQueryMock.Setup(x => x.GetListByEventId(123))
                .Returns(Task.Factory.StartNew(() => guests));
            
            var task = await _emailController.PostEventInviteToGuests(eventGuid, emailMsg);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.NotFound, task);
        }

        [Fact]
        public async Task PostEventInviteToGuests_Return404Null()
        {
            var emailMsg = new EmailMessage();

            string eventGuid = "250c4e21-cf5d-4b5f-bf79-f11978bb18ac";

            _guestQueryMock.Setup(x => x.GetListByEventId(123))
                .Returns(Task.Factory.StartNew(() => ReturnNullGuestList()));

            var task = await _emailController.PostEventInviteToGuests(eventGuid, emailMsg);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.NotFound, task);
        }

        [Fact]
        public async Task PostReservationToVendor_Return202()
        {
            var reservation = new Reservation { id = 1, eventId = "1", vendorId = 1, vendorServiceId = 1, status = "New" };
            var vendor = new Vendor { id = 1, userName = "vendor@example.com", name = "name1", website = "website_1" };
            var service = new VendorServices
            {
                id = 1,
                vendorId = 1,
                flatFee = true,
                price = 20,
                serviceDescription = "desc",
                serviceName = "svcName",
                serviceType = "Venue"
            };

            var emailMsg = new EmailMessage();

            emailMsg.from = new source.Models.Email.EmailRecipient("unit@testEmail.com");
            emailMsg.subject = "Unit Test";

            List<EmailPersonalization> personalizations = new List<EmailPersonalization>();
            EmailPersonalization personalization = new EmailPersonalization();
            personalization.to.Add((new EmailRecipient("unitTest@email.com")));
            personalizations.Add(personalization);
            emailMsg.personalizations = personalizations;

            List<EmailContent> contents = new List<EmailContent>();
            contents.Add(new EmailContent("text/plain", "unit content"));
            emailMsg.content = contents;

            _reservationQueryMock.Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(Task.Factory.StartNew(() => reservation));

            _vendorQueryMock.Setup(x => x.GetById(1))
                .Returns(Task.Factory.StartNew(() => vendor));

            _vendorServiceQueryMock.Setup(x => x.GetById(1))
            .Returns(Task.Factory.StartNew(() => service));

            _emailQueryMock.Setup(x => x.sendEmailViaPostAsync(emailMsg))
            .Returns(Task.Factory.StartNew(() => HttpStatusCode.Accepted));
            
            var task = await _emailController.PostReservationToVendor(1, emailMsg);

            // assert
            Assert.IsType<HttpStatusCode>(task);
            Assert.Equal(HttpStatusCode.Accepted, task);
        }
    }
}
