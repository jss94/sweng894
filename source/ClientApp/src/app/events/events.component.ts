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
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponent } from '../shared/components/email-dialog/email-dialog.component';

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
    private dialog: MatDialog,
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

  showInvite(evnt: OccEvent) {

    const inviteTemplate = 'You are invited to celebrate ' + evnt.description +
      ' which is occurring on ' + evnt.dateTime;

    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: {
          iconName: 'event',
          title: evnt.name + ' - Invitation',
          content: inviteTemplate,
          buttonText1: 'Cancel',
          buttonText2: 'Send'
      }
    });



    dialogRef.afterClosed()
    .subscribe(result => {
      if (result === true) {
        const invitationText = dialogRef.componentInstance.data.content;

        const emailModel: EmailModel = this.createEmailModel(invitationText, evnt.userName);

        this.emailService.sendEventInvitationEmail(evnt.eventId, emailModel).subscribe(response => {
          let statusMsg = 'Successfully emailed your guests!';

          if (response === 404) {
            statusMsg = evnt.name + ' has no guests! Add one and try again!';
          } else if (response !== 202) {
            statusMsg = 'An error occurred sending the email, please contact your administrator.';
          }

          this.snackbar.open(statusMsg, '', {
            duration: 3000
          });
       });
      }
    });
}

  createEmailModel(invitationText: string, evntUserName: string): EmailModel {
    const toEmail = new EmailAddress();
    toEmail.email = evntUserName; // place holder, will be replaced by backend

    const to: EmailAddress[] = [];
    to.push(toEmail);

    const fromEmail = new EmailAddress();
    fromEmail.email = evntUserName;

    const emailContent = new EmailContent();
    emailContent.type = 'text/plain';
    emailContent.value = invitationText;

    const content: EmailContent[] = [];
    content.push(emailContent);

    const emailModel = new EmailModel();
    emailModel.personalizations = [({ 'to': to })];
    emailModel.subject = 'Needs to be updated with User Entered Subject';

    emailModel.from = fromEmail;
    emailModel.content = content;

    return emailModel;
  }

}
