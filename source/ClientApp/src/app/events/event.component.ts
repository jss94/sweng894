import { Component } from '@angular/core';
import { Event } from './Models/event.model';
import { EventService } from './Services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent {
  public events: Event[];

  constructor(private eventService: EventService) {
    this.eventService.getEvents('jss94').subscribe(response => {
      this.events = response;
    });

  }

  createNewEvent(): void {
    console.log('hello there');
    const testEvent: Event = {
      organizerId: 'jss94',
      name: 'New Test Event',
      description: 'My Test Event Description',
      eventCreated: null,
      eventDate: null,
      eventId: null,
      guestListId: null
     };

     console.log('here now');
    this.eventService.createNewEvent(testEvent).subscribe(response => {
      console.log('back in here');
    });

    console.log('here now2');
   }

}
