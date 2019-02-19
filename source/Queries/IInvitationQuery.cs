using System.Threading.Tasks;

namespace source.Queries
{
    public interface IInvitationQuery
    {
        Task saveInvitation(int eventId, string invitationContent);

        Task<string> getInvitation(int eventId);

        Task updateInvitation(int eventId, string invitationContent);

        Task deleteInvitation(int eventId);
    }
}