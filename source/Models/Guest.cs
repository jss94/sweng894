﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace source.Models
{
    public class Guest
    {
        public int guestId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public bool? isGoing { get; set; }
        public int eventId { get; set; }
    }
}
