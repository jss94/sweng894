using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using Dapper;
using source.Models;
using System.Text;
using source.Models.Email;
using System;
using Microsoft.AspNetCore.Http;

namespace source.Queries
{
    /// <summary>
    /// Invitation Repository
    /// </summary>
    public class InvitationQuery : IInvitationQuery
    {
        /// <summary>
        /// database object
        /// </summary>
        protected readonly IAppDatabase _database;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="db">IAppDatabase supplied by dependency injection</param>
        public InvitationQuery(IAppDatabase db)
        {
            _database = db;
        }

        /// <summary>
        /// Get an event invitation content by eventGuid
        /// </summary>
        /// <param name="eventGuid"></param>
        /// <returns></returns>
        public async Task<Invitation> getInvitation(string eventGuid)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.invitations WHERE eventGuid = @eventGuid;";

                // Use the structure new { object } when you are passing in a single param
                // If you pass in the object without the new { } Dapper will look for the 
                // field eventId in the object eventId (ie. eventId.eventId)
                var result = await connection.QueryFirstAsync<Invitation>(query, new { eventGuid });
                return result;
            }
        }

        /// <summary>
        /// Saves an invitation
        /// </summary>
        /// <param name="invitation"></param>
        /// <returns>true if the save was successful, false otherwise</returns>
        public async Task<bool> saveInvitation(Invitation invitation)
        {
            using (var db = _database)
            {
               
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.invitations (eventId, content, subject, eventGuid) "
                    + @"VALUES (@eventId, @content, @subject, @eventGuid)";
                
                await Task.CompletedTask;

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                await connection.ExecuteAsync(query, invitation);
                return true;
            }
        }

        /// <summary>
        /// Updates the invitation in the database with the given one.
        /// </summary>
        /// <param name="invitation"></param>
        /// <returns></returns>
        public async Task<bool> updateInvitation(Invitation invitation)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.invitations"
                    + " SET content=@content,"
                    + " subject=@subject"
                    + " WHERE eventId =  @eventId";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, invitation);
                return true;
            }
        }

        /// <summary>
        /// Deletes the invitation in the database associated to the given eventGuid.
        /// </summary>
        /// <param name="eventGuid"></param>
        /// <returns></returns>
        public async Task<bool> deleteInvitation(string eventGuid)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.invitations WHERE eventGuid = @eventGuid";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, new { eventGuid });
                return true;
            }
        }

        public EmailContent updateInvitationContentToIncludeRSVP(Guest guest, EmailContent emailContent, HttpContext httpContext)
        {
            HttpRequest request = httpContext.Request;
            string content = emailContent.value;
            StringBuilder htmlBuilder = new StringBuilder();
            htmlBuilder.AppendLine("<div>").Append(content).Append("</div>");
            htmlBuilder.AppendLine(createRsvpLinkContent(createBaseUrl(request.IsHttps, request.Host.ToString()), guest));

            return new EmailContent("text/html", htmlBuilder.ToString());
        }

        private string createBaseUrl(bool isHttps, string host)
        {
            string rsvpUrlBase = "http://";
            if (isHttps)
            {
                rsvpUrlBase = "https://";
            }

            return rsvpUrlBase + host;
        }

        private string createRsvpLinkContent(string rsvpBaseUrl, Guest guest)
        {
            var eventLink = $"<div> <a href='{rsvpBaseUrl}/events/{guest.eventGuid}'>Go to the event.</a></div>";
            var isGoingLink = $"<div> <a href='{rsvpBaseUrl}/api/guest/rsvp/{guest.guestId}?isGoing=true'>Going</a></div>";
            var isNotGoingLink = $"<div> <a href='{rsvpBaseUrl}/api/guest/rsvp/{guest.guestId}?isGoing=false'>Not Going</a></div>";

            var guid = $"<div>Event Code = {guest.eventGuid} </div>";

            return eventLink
            + $"<div> RSVP </div>"
            + isGoingLink
            + isNotGoingLink
            + guid;
        }
        
    }
}