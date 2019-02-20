using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using source.Database;
using Dapper;
using source.Models;

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
        public async Task<Invitation> getInvitation(int eventId)
        {
            using (var db = _database)
            {
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                string query = @"SELECT * FROM occasions.invitations WHERE eventId = @eventId;";

                // Use the structure new { object } when you are passing in a single param
                // If you pass in the object without the new { } Dapper will look for the 
                // field eventId in the object eventId (ie. eventId.eventId)
                var result = await connection.QueryFirstAsync<Invitation>(query, new { eventId });
                return result;
            }
        }

        /// <summary>
        /// Saves an invitation
        /// </summary>
        /// <param name="invitation"></param>
        /// <returns>true if the save was successful, false otherwise</returns>
        public async Task saveInvitation(Invitation invitation)
        {
            using (var db = _database)
            {
               
                var connection = db.Connection as MySqlConnection;
                await connection.OpenAsync();

                // I left these all caps because Dapper doesnt care
                string query = @"INSERT INTO occasions.invitations (eventId, content, subject) "
                    + @"VALUES (@eventId, @content, @subject)";

                await Task.CompletedTask;

                // Here we pass in the entire event without the new  { }
                // Dapper will rightly look for fields like evnt.eventName doing this
                await connection.ExecuteAsync(query, invitation);
            }
        }

        public async Task updateInvitation(Invitation invitation)
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
                await connection.ExecuteAsync(query, new { invitation});
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