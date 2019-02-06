import { Component, OnInit } from '@angular/core';
import { OccEvent } from './Models/occ-event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: [ './events.component.css']
})
export class EventsComponent implements OnInit {
  events: OccEvent[];

  userName: string;

  eventForm = new FormGroup({
    name: new FormControl('', [ Validators.required]),
    description: new FormControl('', [ Validators.required]),
  });

  constructor(private auth: AuthService, private eventService: EventService) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.userName = this.auth.user.userName;
      this.eventService.getEvents(this.auth.user.userName).subscribe(response => {
        this.events = response;
      });
    } else {
      this.auth.user$.subscribe((result) => {
        this.userName = result.userName;
        this.eventService.getEvents(result.userName).subscribe(response => {
          this.events = response;
        });
      });
    }

  }

  onCreate(): void {
    const testEvent: OccEvent = {
      userName: this.userName,
      name:  this.eventForm.controls['name'].value,
      description:  this.eventForm.controls['description'].value,
      dateTime: '2019/02/14 10:00:00', // hard coded for now
      created: ' ',
      // eventId is handled by the db, this is a temporary value.
      eventId: -1,
      guestListId: -1
     };

    this.eventService.createNewEvent(testEvent).subscribe(response => {
       // reload page
      this.ngOnInit();
    });

  }

   updateEvent(changedName: string, changedDescription: string, evnt: OccEvent): void {
     evnt.name = changedName;
     evnt.description = changedDescription;
    this.eventService.updateEvent(evnt).subscribe(response => {
      // reload page
     this.ngOnInit();
   });
   }

   deleteEvent(evnt: OccEvent): void {
    this.eventService.deleteEvent(evnt).subscribe(response => {
      // reload page
      this.ngOnInit();
    });
  }

}
