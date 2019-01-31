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
