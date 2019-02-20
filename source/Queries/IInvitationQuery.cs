using System.Threading.Tasks;

namespace source.Queries
{
    public interface IInvitationQuery
    {
        Task saveInvitation(int eventId, string content);

        Task<string> getInvitation(int eventId);

        Task updateInvitation(int eventId, string content);

        Task deleteInvitation(int eventId);
    }
}