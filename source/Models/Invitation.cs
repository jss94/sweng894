using System;

namespace source.Models
{
    /// <summary>
    /// Invitation model.
    /// </summary>
    public class Invitation

    {
        /// <summary>
        /// unique number for invitation 
        /// </summary> 
        public int invitationId { get; set; }

        /// <summary>
        /// The event id that this invitation is associated to.
        /// </summary> 
        public int eventId { get; set; }

        /// <summary>
        /// Gets or sets the event GUID.
        /// </summary>
        /// <value>The event GUID.</value>
        public string eventGuid { get; set; }

        /// <summary>
        /// The invitation subject (i.e email subject)
        /// </summary> 
        public String subject { get; set; }

        /// <summary>
        /// The user provided invitation content.
        /// </summary> 
        public String content { get; set; }
 
    }
}
