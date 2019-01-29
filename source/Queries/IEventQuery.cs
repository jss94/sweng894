using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IEventQuery
    {
        Task<List<Event>> GetAllEventsByUser(string organizer_id);
        Task<Event> GetOneEventById(int eventId);
        Task<int> CreateNewEvent(Event evnt);
        Task UpdateEvent(Event evnt);
    }
}