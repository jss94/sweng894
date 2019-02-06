using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IEventQuery
    {
        Task<List<Event>> GetAllEventsByUser(string username);
        Task<Event> GetEventById(int id);
        Task<Event> CreateEvent(Event evnt);
        Task<Event> UpdateEvent(Event evnt);
        Task<bool> DeleteEvent(Event id);
    }
}