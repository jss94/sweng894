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
using static SendGrid.SendGridClient;

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

        public EmailControllerShould()
        {
            _vendorQueryMock = new Mock<IVendorsQuery>();
            _guestQueryMock = new Mock<IGuestQuery>();
            _loggerMock = new Mock<ILogger>();
            _emailQueryMock = new Mock<IEmailQuery>();
            _emailController = new EmailController(_vendorQueryMock.Object, _guestQueryMock.Object, _loggerMock.Object, _emailQueryMock.Object);
        }
        
        [Fact]
        public void PostQuestionToVendor_Return202()
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
            
            var task = _emailController.PostQuestionToVendor(123, emailMsg);

            // assert
            Assert.IsType<HttpStatusCode>(task.Result);
            
            Assert.True(task.Result.Equals(HttpStatusCode.Accepted));
        }

        [Fact]
        public void PostEventInviteToGuests_Return202()
        {
            List<Guest> guests = new List<Guest>();
            guests.Add(new Guest { guestId = 123, name = "Guest1", email = "test1@psu.edu", isGoing = true, eventId = 1 });
            guests.Add(new Guest { guestId = 124, name = "Guest2", email = "test2@psu.edu", isGoing = true, eventId = 1 });

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
            
            _guestQueryMock.Setup(x => x.GetListByEventId(guests[0].eventId))
                .Returns(Task.Factory.StartNew(() => guests));

            _emailQueryMock.Setup(x => x.sendEmailViaPostAsync(emailMsg))
            .Returns(Task.Factory.StartNew(() => HttpStatusCode.Accepted));

            var task = _emailController.PostEventInviteToGuests(1, emailMsg);
            
            // assert
            Assert.IsType<HttpStatusCode>(task.Result);

            Assert.True(task.Result.Equals(HttpStatusCode.Accepted));

        }
    }
}
