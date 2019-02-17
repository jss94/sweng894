import { Component, OnInit } from '@angular/core';
import { OccEvent } from '../events/Models/occ-event.model';
import { EventService } from '../events/Services/event.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    public auth: AuthService
    ) { }

  theEvent: OccEvent;

  ngOnInit() {
    this.getEvent();
  }

  getEvent(): void {
    // the + converts the id parameter from a string to a number
    const eventId = +this.route.snapshot.paramMap.get('eventId');
    const userName = this.route.snapshot.paramMap.get('userName');
    this.eventService.getEvent(userName, eventId).subscribe(event => this.theEvent = event);
  }

}
