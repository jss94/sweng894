using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using Dapper;
using System;

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
        /// Get an event invitation content by event id
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns></returns>
        public async Task<String> getInvitation(int eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.invitations WHERE eventId = @eventId;";

                // Use the structure new { object } when you are passing in a single param
                // If you pass in the object without the new { } Dapper will look for the 
                // field eventId in the object eventId (ie. eventId.eventId)
                var result = await connection.QueryFirstAsync<String>(query, new { eventId });
                return result;
            }
        }

        /// <summary>
        /// Saves an invitation
        /// </summary>
        /// <param name="eventId"></param>
        /// <param name="content"></param>
        /// <returns>true if the save was successful, false otherwise</returns>
        public async Task saveInvitation(int eventId, String content)
        {
            using (var db = _database)
            {
               
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.invitations (eventId, content) "
                    + @"VALUES (@eventId, @content)";

                await Task.CompletedTask;

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                await connection.ExecuteAsync(query, new { eventId, content });
            }
        }

        public async Task updateInvitation(int eventId, string content)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"UPDATE occasions.invitations"
                    + " SET content=@content,"
                    + " WHERE eventId =  @eventId";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, new { content, eventId });
            }
        }

        public async Task deleteInvitation(int eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"DELETE FROM occasions.invitations WHERE eventId = @eventId";

                await Task.CompletedTask;
                await connection.ExecuteAsync(query, new { eventId });
            }
        }
    }
}