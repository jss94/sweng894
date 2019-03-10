import { Component, OnInit } from '@angular/core';
import { OccEvent } from './Models/occ-event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { EventDialogComponent } from '../shared/components/event-dialog/event-dialog.component';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';

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
    description: new FormControl('', [Validators.required]),
    time: new FormControl('', Validators.required),
  });

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private eventService: EventService,
    private router: Router,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe,
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
    // default time for new event
    this.eventForm.controls['time'].setValue('12:00');
  }

  setEvents(user: User) {
    this.userName = user.userName;
    this.eventService.getEvents(user.userName).subscribe(response => {
      this.events = response;
    });
  }

  onCreate(): void {

    // get calendar date, time and concatenate together for one date
    const evntDate = this.eventForm.controls['date'].value;
    const evntTime = this.eventForm.controls['time'].value;
    const evDate = this.createDateWithTime(evntDate, evntTime);

    const event: OccEvent = {
      userName: this.userName,
      name:  this.eventForm.controls['name'].value,
      description:  this.eventForm.controls['description'].value,
      dateTime: evDate,
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

  createDateWithTime(dateWithoutTime: any, time: any): any {
    const timeArr = time.split(':');
    dateWithoutTime.setHours(timeArr[0]);
    dateWithoutTime.setMinutes(timeArr[1]);
    dateWithoutTime.setSeconds(0);
    return this.datePipe.transform(dateWithoutTime, 'yyyy-MM-dd HH:mm:ss');
  }

  onEditEventClicked(event: OccEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
          iconName: 'event',
          title: 'Update ' + event.name,
          buttonText: 'Update',
          event: event
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result.data.save) {
          const newDate = new Date(result.data.newDate);
          const updatedDate = this.createDateWithTime(newDate, result.data.eventTime);
          this.updateEvent(result.data.newName, result.data.newDescription, updatedDate, result.data.event);
        }
    });
  }

  updateEvent(changedName: string, changedDescription: string, changedDate: any, evnt: OccEvent): void {
    evnt.name = changedName;
    evnt.description = changedDescription;
    evnt.dateTime = changedDate;
    this.eventService.updateEvent(evnt).subscribe(() => {
      // reload page
      this.ngOnInit();
      // this.snackbar.open('Response: ' + response, '', {
      //   duration: 3000
      // });
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
