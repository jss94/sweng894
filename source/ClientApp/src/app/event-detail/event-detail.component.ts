import { Component, OnInit } from '@angular/core';
import { OccEvent } from '../events/Models/occ-event.model';
import { EventService } from '../events/Services/event.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EmailService } from '../send-email/Services/email.service';
import { InvitationService } from '../invitations/Services/invitation.service';
import { InvitationModel } from '../invitations/Models/invitation.model';
import { EmailDialogComponent } from '../shared/components/email-dialog/email-dialog.component';
import { Observable } from 'rxjs';
import { EmailModel } from '../send-email/Models/email.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private emailService: EmailService,
    private invitationService: InvitationService,
    private dialog: MatDialog,
    ) { }

  theEvent: OccEvent;

  invitationModel: InvitationModel;

  ngOnInit() {
    this.getEvent();
  }

  getEvent(): void {
    const guid = this.route.snapshot.paramMap.get('guid');
    this.eventService.getEvent(guid).subscribe(event => this.theEvent = event);
  }

  loadInvite(evnt: OccEvent) {

    this.invitationService.getInvitation(evnt.guid).subscribe(invitationResponse => {
      // invitation exists
      this.invitationModel = invitationResponse;
      this.showInviteDialog(evnt);
    }, error => {
        // invitation does not exist
        this.invitationModel = ({
          eventGuid: evnt.guid,
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

        // update content and subject of invitation
        this.invitationModel.content = result.data.content;
        this.invitationModel.subject = result.data.subject;

        // save the invitation first
        this.persistInvitation().subscribe(response => {
          this.displayInvitationFeedback(response, 'Invitation Updated', 'An error occurred saving your invitation');
          if (result.data.button === true) {
              // send the invitation
              this.sendEmail(evnt).subscribe(emailResponse => {
              this.displayEmailFeedback(evnt, emailResponse);
            });
          }
        });
    });
  }

  persistInvitation(): Observable<any> {
    if (this.invitationModel.invitationId) {
        return this.invitationService.updateInvitation(this.invitationModel);
    } else {
      return this.invitationService.createNewInvitation(this.invitationModel);
    }
  }

  displayInvitationFeedback(responseCode: any, successMsg: any, failureMsg: any) {
    let status = successMsg;
    if (responseCode !== 200) {
      status = failureMsg;
    }
    this.snackbar.open(status, '', {
      duration: 3000
    });
  }

  displayEmailFeedback(evnt: OccEvent, response: any) {
    let statusMsg = 'Successfully emailed your guests!';

    if (response === 404) {
      statusMsg = evnt.name + ' has no guests! Add one and try again!';
    } else if (response !== 202) {
      statusMsg = 'An error occurred sending the email, please contact your administrator.';
    }

    this.snackbar.open(statusMsg, '', {
      duration: 3000
    });
  }

  sendEmail(evnt: OccEvent): Observable<any> {
    const emailModel: EmailModel = this.emailService.createEmailModel(this.invitationModel.subject,
    this.invitationModel.content, evnt.userName);
    return this.emailService.sendEventInvitationEmail(this.invitationModel.eventGuid, emailModel);
  }

}
