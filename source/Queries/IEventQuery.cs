using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IEventQuery
    {
        Task<List<Event>> GetAllEventsByUser(string username);
        Task<Event> GetEventById(int id);
        Task<Event> GetEventByGuid(string guid);
        Task CreateEvent(Event evnt);
        Task UpdateEvent(Event evnt);
        Task DeleteById(int id);
        Task DeleteByUserName(string userName);

    }
}