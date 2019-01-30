import { Component, OnInit } from '@angular/core';
import { Event } from './Models/event.model';
import { EventService } from './Services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent implements OnInit {
  public events: Event[];

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getEvents('jss94').subscribe(response => {
      this.events = response;
    });
  }

  createNewEvent(): void {
    const testEvent: Event = {
      organizerId: 'jss94',
      name: 'New Test Event',
      description: 'My Test Event Description',
      eventCreated: null,
      eventDate: null,
      // eventId is handled by the db, this is a temporary value.
      eventId: 1,
      guestListId: null
     };

    this.eventService.createNewEvent(testEvent).subscribe(response => {
      // Response returned - TODO handle?
    });

   }

}
