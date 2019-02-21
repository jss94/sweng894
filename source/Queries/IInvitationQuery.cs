using source.Models;
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
        Task saveInvitation(Invitation invitation);

        /// <summary>
        /// Retrieves the Invitation associated with the given eventId
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns></returns>
        Task<Invitation> getInvitation(int eventId);

        /// <summary>
        /// Updates the Invitation with the given one.
        /// </summary>
        /// <param name="invitation"></param>
        /// <returns></returns>
        Task updateInvitation(Invitation invitation);

        /// <summary>
        /// Deletes the invitation associated to the given eventId
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns></returns>
        Task deleteInvitation(int eventId);
    }
}