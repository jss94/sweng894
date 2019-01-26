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
}
