using Microsoft.AspNetCore.Http;
using source.Models;
using source.Models.Email;
using System.Threading.Tasks;

namespace source.Queries
{
    /// <summary>
    /// Interface for the InvitationQuery. Responsible for Creating, Retrieving, Updating and Deleting an Invitation.
    /// </summary>
    public interface IInvitationQuery
    {
        /// <summary>
        /// Saves the given Invitation
        /// </summary>
        /// <param name="invitation"></param>
        /// <returns></returns>
        Task<bool> saveInvitation(Invitation invitation);

        /// <summary>
        /// Retrieves the Invitation associated with the given eventGuid
        /// </summary>
        /// <param name="eventGuid"></param>
        /// <returns></returns>
        Task<Invitation> getInvitation(string eventGuid);

        /// <summary>
        /// Updates the Invitation with the given one.
        /// </summary>
        /// <param name="invitation"></param>
        /// <returns></returns>
        Task<bool> updateInvitation(Invitation invitation);

        /// <summary>
        /// Deletes the invitation associated to the given eventId
        /// </summary>
        /// <param name="eventGuid"></param>
        /// <returns></returns>
        Task<bool> deleteInvitation(string eventGuid);

        /// <summary>
        /// Takes the given EmailContent and returns an EmailContent that includes RSVP links for the invitation.
        /// </summary>
        EmailContent updateInvitationContentToIncludeRSVP(Guest guest, EmailContent emailContent, HttpContext httpContext);
    }
}