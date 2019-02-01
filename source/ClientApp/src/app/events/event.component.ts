import { Component, OnInit } from '@angular/core';
import { Event } from './Models/event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: [ './event.component.css']
})
export class EventComponent implements OnInit {
  public events: Event[];

  userForm = new FormGroup({
    name: new FormControl('', [ Validators.required]),
    description: new FormControl(''),
  });

  constructor(private auth: AuthService, private eventService: EventService) {
  }

  ngOnInit() {
    const nickname = this.auth.userProfile.nickname;
    this.eventService.getEvents(nickname).subscribe(response => {
      this.events = response;
      this.events.forEach(element => {
        console.log(JSON.stringify(element));
      });
    });
  }

  createNewEvent(): void {

    const nickname = this.auth.userProfile.nickname;
    const testEvent: Event = {
      organizerUserName: nickname,
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

}
