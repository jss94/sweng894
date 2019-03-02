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
    const guid = this.route.snapshot.paramMap.get('guid');
    this.eventService.getEvent(guid).subscribe(event => this.theEvent = event);
  }

}
