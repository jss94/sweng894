import { Component, OnInit } from '@angular/core';
import { OccEvent } from './Models/occ-event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { EmailService } from '../send-email/Services/email.service';
import { EmailModel } from '../send-email/Models/email.model';
import { EmailAddress } from '../send-email/Models/email.address.model';
import { EmailContent } from '../send-email/Models/email.content.model';

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
    private emailService: EmailService
    ) {
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

  // TODO: Add time!!!
  onCreate(): void {
    const event: OccEvent = {
      userName: this.userName,
      name:  this.eventForm.controls['name'].value,
      description:  this.eventForm.controls['description'].value,
      dateTime: this.eventForm.controls['date'].value.toISOString().slice(0, 19).replace('T', ' '),
      created: new Date().toISOString().slice(0, 19).replace('T', ' '),
     };

    this.eventService.createNewEvent(event).subscribe(response => {
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
    this.eventService.updateEvent(evnt).subscribe(response => {
      // reload page
     this.ngOnInit();
   });
   }

   onGuestsClicked(event: OccEvent): void {
    this.router.navigate(['/guests/' + event.eventId]);
   }

   deleteEvent(evnt: OccEvent): void {
    this.eventService.deleteEvent(evnt).subscribe(response => {
      // reload page
      this.ngOnInit();
      this.snackbar.open('Successfully Deleted ' + evnt.name, '', {
        duration: 3000
      });
    });
  }

  testEmail(evnt: OccEvent) {

    const toEmail = new EmailAddress();
    toEmail.email = 'senky.joe@gmail.com';

    const to: EmailAddress[] = [];
    to.push(toEmail);

    const fromEmail = new EmailAddress();
    fromEmail.email = 'jss94@psu.edu';

    const emailContent = new EmailContent();
    emailContent.type = 'text/plain';
    emailContent.value = 'Welcome!!!';

    const content: EmailContent[] = [];
    content.push(emailContent);

    const emailModel = new EmailModel();
    emailModel.personalizations = [({ 'to': to })];
    emailModel.subject = 'Email from SWENG 894 Occasions';

    emailModel.from = fromEmail;
    emailModel.content = content;

    console.log(JSON.stringify(emailModel));
    this.emailService.sendEmail(emailModel).subscribe(response => {
      console.log('BACK HERE');
   });
  }

}
