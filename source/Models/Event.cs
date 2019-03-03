using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class Event

    {
        // unique string for event identifier
        public int eventId { get; set; }

        // reference to the organizer who created the event.
        public string userName { get; set; }

        //reference to the identifier of the guest list
        public int guestListId { get; set; }

        //The name of the Event.
        public string name { get; set; }

        //The description of the Event.
        public string description { get; set; }

        //The date that the event will be held.
        public string dateTime { get; set; }

        /// <summary>
        /// Gets or sets the created.
        /// </summary>
        /// <value>The created.</value>
        public string created { get; set; }

        /// <summary>
        /// Gets or sets the GUID.
        /// </summary>
        /// <value>The GUID.</value>
        public string guid { get; set; }

        /* 
         * TODO 
         * - have variable to capture Venue_id
         * - Venue_id would be able to link to the Address of the Venue
         * - Do we want to have a create date? or modified date to track changes in the future?
         */
    }
}
