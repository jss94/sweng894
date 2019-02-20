using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace source.BusinessLogic
{
    public class CalendarBusinessLogic
    {
        private CalendarService service;

        public CalendarBusinessLogic()
        {
            UserCredential credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                new ClientSecrets
                {
                    ClientId = "568345394666-vpa9ecfse2mqkv4ac667rac5u7b8f9br.apps.googleusercontent.com",
                    ClientSecret = "kuaj7cQzeFNPlVqHrKNyrLYF",
                },
                new[] { CalendarService.Scope.Calendar },
                "user",
                CancellationToken.None).Result;

            // Create the service.
            service = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Occasions",
            });
        }

        public List<CalendarListEntry> GetCalendarEvents()
        {
            return service.CalendarList.List().Execute().Items.ToList();
        }
    }
}
