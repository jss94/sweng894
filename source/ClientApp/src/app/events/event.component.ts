import { Component } from '@angular/core';
import { Event } from './Models/event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent {
  public events: Event[];

  constructor(private auth: AuthService, private eventService: EventService) {
  //  let username = this.auth.userProfile.organizerUserName;
  //  if (username == null) {
   //   console.log('Username was null!');
    //  username = 'jss94';
   // }
    this.eventService.getEvents('jss94').subscribe(response => {
      this.events = response;
    });

  }

  createNewEvent(): void {
    const nickname = 'jss94'; // this.auth.userProfile.nickname;
    const username = 'jss94'; // this.auth.userProfile.organizerUserName;
    const testEvent: Event = {
      organizerUserName: username,
      eventName: nickname + '\'s New Test Event',
      eventDescription: nickname + '\'s Event Description',
      eventDateTime: '2019/02/14 10:00:00',
      eventCreated: '2019/01/28',
      // eventId is handled by the db, this is a temporary value.
      eventId: -1,
      guestListId: -1
     };

    this.eventService.createNewEvent(testEvent).subscribe(response => {
      location.reload();
    });

   }

}
