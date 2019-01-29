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
      organizerUserName: 'jss94',
      eventName: 'New Test Event',
      eventDescription: 'My Test Event Description',
      eventDateTime: '2019/02/14 10:00:00',
      eventCreated: '2019/01/28',
      // eventId is handled by the db, this is a temporary value.
      eventId: 1,
      guestListId: 0
     };

    this.eventService.createNewEvent(testEvent).subscribe(response => {
      location.reload();
    });

   }

}
