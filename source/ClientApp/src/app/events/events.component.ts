import { Component, OnInit } from '@angular/core';
import { OccEvent } from './Models/occ-event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: [ './events.component.css']
})
export class EventsComponent implements OnInit {
  events: OccEvent[];

  userName: string;

  eventForm = new FormGroup({
    date: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required] ),
  });

  constructor(
    private auth: AuthService,
    private eventService: EventService,
    private router: Router,
    private snackbar: MatSnackBar,
   ) {
  }

  ngOnInit() {
    const user = this.auth.user;
    if (user) {
      this.setEvents(user);
    } else {
      this.auth.user$.subscribe((result) => {
        this.setEvents(result);
      });
    }
  }

  setEvents(user: User) {
    this.userName = user.userName;
    this.eventService.getEvents(user.userName).subscribe(response => {
      this.events = response;
    });
  }

  onCreate(): void {
    const event: OccEvent = {
      userName: this.userName,
      name:  this.eventForm.controls['name'].value,
      description:  this.eventForm.controls['description'].value,
      dateTime: this.eventForm.controls['date'].value.toISOString().slice(0, 19).replace('T', ' '),
      created: new Date().toISOString().slice(0, 19).replace('T', ' '),
     };

    this.eventService.createNewEvent(event).subscribe(() => {
      this.ngOnInit();
      this.eventForm.reset();
      this.snackbar.open('Successfully Created ' + event.name, '', {
        duration: 1500
      });
    });

  }

   updateEvent(changedName: string, changedDescription: string, evnt: OccEvent): void {
     evnt.name = changedName;
     evnt.description = changedDescription;
    this.eventService.updateEvent(evnt).subscribe(() => {
      // reload page
     this.ngOnInit();
   });
   }

   onGuestsClicked(event: OccEvent): void {
    this.router.navigate(['/guests/' + event.guid]);
   }

   onViewEventClicked(event: OccEvent): void {
    this.router.navigate(['/events/' + event.guid]);
   }

   deleteEvent(evnt: OccEvent): void {
    this.eventService.deleteEvent(evnt).subscribe(() => {
      // reload page
      this.ngOnInit();
      this.snackbar.open('Successfully Deleted ' + evnt.name, '', {
        duration: 3000
      });
    });
  }
}
