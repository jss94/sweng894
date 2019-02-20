import { Component, OnInit } from '@angular/core';
import { OccEvent } from './Models/occ-event.model';
import { EventService } from './Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { EmailService } from '../send-email/Services/email.service';
import { EmailModel } from '../send-email/Models/email.model';
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponent } from '../shared/components/email-dialog/email-dialog.component';
import { InvitationService } from '../invitations/Services/invitation.service';
import { InvitationModel } from '../invitations/Models/invitation.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: [ './events.component.css']
})
export class EventsComponent implements OnInit {
  events: OccEvent[];

  userName: string;

  invitationModel: InvitationModel;

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
    private emailService: EmailService,
    private invitationService: InvitationService,
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

  loadInvite(evnt: OccEvent) {

    this.invitationService.getInvitation(evnt.eventId).subscribe(invitationResponse => {
      // invitation exists
      this.invitationModel = invitationResponse;
      this.showInviteDialog(evnt);
    }, error => {
        // invitation does not exist
       this.invitationModel = ({
          eventId: evnt.eventId,
          subject: 'You\'re Invited!',
          content: 'You are invited to celebrate ' + evnt.description
        });
        this.showInviteDialog(evnt);
    });
  }

  showInviteDialog(evnt: OccEvent) {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: {
          iconName: 'event',
          title: evnt.name + ' - Invitation',
          subject: this.invitationModel.subject,
          content: this.invitationModel.content,
          buttonText1: 'Save & Close',
          buttonText2: 'Send'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {

        this.invitationModel.content = result.data.content;
        this.invitationModel.subject = result.data.subject;

        this.persistInvitation();
        if (result.button === true) {
          // save and send the invitation
           this.sendEmail(evnt);
        }
    });
  }

  persistInvitation() {
    if (this.invitationModel.invitationId) {
      this.invitationService.updateInvitation(this.invitationModel).subscribe(updateResponse => {
        this.displayFeedback(updateResponse, 'Invitation Updated', 'An error occurred updating your invitation');
      });
    } else {
      this.invitationService.createNewInvitation(this.invitationModel).subscribe(createResponse => {
        this.displayFeedback(createResponse, 'Invitation Saved', 'An error occurred updating your invitation');
      });
    }
  }

  displayFeedback(responseCode: any, successMsg: any, failureMsg: any) {
    let status = successMsg;
    if (responseCode !== 200) {
      status = failureMsg;
    }
    this.snackbar.open(status, '', {
      duration: 3000
    });
  }

  sendEmail(evnt: OccEvent) {
    const emailModel: EmailModel = this.emailService.createEmailModel(this.invitationModel.subject,
      this.invitationModel.content, evnt.userName);

    this.emailService.sendEventInvitationEmail(this.invitationModel.eventId, emailModel).subscribe(response => {
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
}
