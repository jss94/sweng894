using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IEventQuery
    {
        Task<List<Event>> GetAllEventsByUser(string username);
        Task<Event> GetEventById(int id);
        Task CreateEvent(Event evnt);
        Task UpdateEvent(Event evnt);
        Task DeleteById(int id);
        Task DeleteByUserName(string userName);

    }
}