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
    const testEvent: Event = {
      organizerId: 'jss94',
      name: 'New Test Event',
      description: 'My Test Event Description',
      eventDateTime: 'empty',
      eventCreated: 'empty',
      // eventId is handled by the db, this is a temporary value.
      eventId: 1,
      guestListId: 0
     };

    this.eventService.createNewEvent(testEvent).subscribe(response => {
      location.reload();
    });

   }

}
