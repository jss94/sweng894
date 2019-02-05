import { Component, OnInit } from '@angular/core';
import { Event } from './Models/event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: [ './event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[];
  userName: string;

  userForm = new FormGroup({
    name: new FormControl('', [ Validators.required]),
    description: new FormControl('', [ Validators.required]),
  });

  constructor(private auth: AuthService, private eventService: EventService) {
  }

  ngOnInit() {
    this.auth.user$.subscribe((result) => {
      this.userName = result.userName;

      this.eventService.getEvents(this.userName).subscribe(response => {
        this.events = response;
        this.events.forEach(element => {
          console.log(JSON.stringify(element));
        });
      });
    });

  }

  createNewEvent(): void {
    const testEvent: Event = {
      organizerUserName: this.userName,
      eventName:  this.userForm.controls['name'].value,
      eventDescription:  this.userForm.controls['description'].value,
      eventDateTime: '2019/02/14 10:00:00', // hard coded for now
      eventCreated: ' ',
      // eventId is handled by the db, this is a temporary value.
      eventId: -1,
      guestListId: -1
     };

    this.eventService.createNewEvent(testEvent).subscribe(response => {
       // reload page
      this.ngOnInit();
    });

  }

   updateEvent(changedName: string, changedDescription: string, evnt: Event): void {
     evnt.eventName = changedName;
     evnt.eventDescription = changedDescription;
    this.eventService.updateEvent(evnt).subscribe(response => {
      // reload page
     this.ngOnInit();
   });
   }

   deleteEvent(evnt: Event): void {
    this.eventService.deleteEvent(evnt).subscribe(response => {
      // reload page
      this.ngOnInit();
    });
  }

}
