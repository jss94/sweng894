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
import { Reservation } from '../reservations/Models/reservation.model';
import { ReservationsService } from '../reservations/Services/reservations.service';
import { ReservationDialogComponent } from '../shared/components/reservation-dialog/reservation-dialog.component';
import { Address } from 'src/app/shared/models/address.model';

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
    private reservationService: ReservationsService,
  ) { }

  theEvent: OccEvent;

  address: Address;

  invitationModel: InvitationModel;

  reservations: Reservation[];

  loadedReservations: boolean;

  ngOnInit() {
    this.getEvent();
    this.getReservations();
  }

  getEvent(): void {
    const guid = this.route.snapshot.paramMap.get('guid');
    this.eventService.getEvent(guid).subscribe(event => this.theEvent = event);
  }

  getReservations(): void {
    const guid = this.route.snapshot.paramMap.get('guid');
    this.reservationService.getReservationsByEventGuid(guid).subscribe(res => {
      this.reservations = res;
      this.loadedReservations = true;
      if(res && this.reservations.length > 0){
        let venue = this.reservations.find(x => x.vendorService.serviceType == 'Venue');
        if(venue != null){
          this.address = venue.vendor.address;
        }
      }
    });
  }

  loadReservations(evnt: OccEvent) {
      this.showReservationsDialog(evnt);
  };

  showReservationsDialog(evnt: OccEvent) {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '600px',
      height: '70%',
      data: {
        iconName: 'event_available',
        title: evnt.name + ' - Reservations',
        reservations: this.reservations,
      }
    });
  }

  loadInvite(evnt: OccEvent) {
    console.log('in loadInvite');
    this.invitationService.getInvitation(evnt.guid).subscribe(invitationResponse => {
      if (invitationResponse != null) {
        // invitation exists
        this.invitationModel = invitationResponse;
        this.showInviteDialog(evnt);
      } else {
        // invitation does not exist
        this.invitationModel = ({
          eventGuid: evnt.guid,
          subject: 'You\'re Invited!',
          content: 'You are invited to celebrate ' + evnt.description
        });
        this.showInviteDialog(evnt);
      }
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
