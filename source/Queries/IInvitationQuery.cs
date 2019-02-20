using source.Models;
using System.Threading.Tasks;

namespace source.Queries
{
    public interface IInvitationQuery
    {
        Task saveInvitation(Invitation invitation);

        Task<Invitation> getInvitation(int eventId);

        Task updateInvitation(Invitation invitation);

        Task deleteInvitation(int eventId);
    }
}