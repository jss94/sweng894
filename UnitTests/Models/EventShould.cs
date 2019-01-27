using source.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace UnitTests.Models
{
    public class EventShould
    {
        [Fact]
        public void EventShouldTest()
        {
            //Create new empty event.
            var myEvent = new Event { };

            //Set description
            myEvent.description = "This is the best party ever!";

            //Test Setter - while pointless to test getter/setter, I am new to C#
            Assert.Equal("This is the best party ever!", myEvent.description);
        }
    }
}
