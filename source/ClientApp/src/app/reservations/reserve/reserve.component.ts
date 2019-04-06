import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute, ParamMap, Event } from '@angular/router';
import { EmailService } from '../../send-email/Services/email.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';
import { VendorServicesService } from 'src/app/vendor-services/Services/vendor-services.service';
import { EventService } from 'src/app/events/Services/event.service';
import { OccEvent } from 'src/app/events/Models/occ-event.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GuestsService } from 'src/app/guests/Services/guests.service';
import { subscribeOn } from 'rxjs/operators';
import { Reservation } from '../Models/reservation.model';
import { ReservationsService } from '../Services/reservations.service';
import { EmailModel } from 'src/app/send-email/Models/email.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})

export class ReserveComponent implements OnInit {
  vendorServiceModel: VendorServices
  userName: string
  userEvents: OccEvent[]
  eventModel: OccEvent
  eventGuestNum: number
  cost: number
  reservations: Reservation[]

  reservationForm = new FormGroup({
    eventList: new FormControl('', [Validators.required]),
    numberReserved: new FormControl(''),
  });

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private emailService: EmailService,
    private vendorServicesService: VendorServicesService,
    private eventService: EventService,
    private guestService: GuestsService,
    private reservationService: ReservationsService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.cost = 0.00;
    this.setUser();
    this.setVendorService();
    this.getUserEvents();
    this.subscribeCost();
  }

  setUser() {
    if (this.auth.user) {
      this.userName = this.auth.user.userName;
    } else {
      this.auth.user$.subscribe((result) => {
        this.userName = result.userName;
      });
    }
  }

  setVendorService() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const svcId = +params.get('id');
      this.vendorServicesService.getVendorServiceById(svcId).subscribe(response => {
        this.vendorServiceModel = response;
        let maxNumber = 1;
        if (this.vendorServiceModel.unitsAvailable != null && this.vendorServiceModel.unitsAvailable > 1) {
          maxNumber = this.vendorServiceModel.unitsAvailable;
          this.reservationForm.controls["numberReserved"].setValidators([Validators.required, Validators.min(1), Validators.max(maxNumber)]);
        }
        else {
          this.reservationForm.controls["numberReserved"].setValue(1);
          maxNumber = 1;
        }
      });
    }, error => {
      console.log(error);
    });
  }

  getUserEvents() {
    this.eventService.getEvents(this.userName).subscribe(response => {
      this.userEvents = response
      if (this.userEvents.length == 1) {
        this.eventModel = this.userEvents[0];
        this.reservationForm.controls['eventList'].setValue(this.eventModel.guid);    
      }
      if (this.userEvents.length > 1) {
        this.subscribeEventChoice();
      }
    });

  }

  getNumGuests(value) {
    let message = ""
    this.guestService.getGuests(value).subscribe(guestresponse => {
      if (guestresponse != null) {
        this.eventGuestNum = guestresponse.length
        if (this.vendorServiceModel.flatFee != true && this.vendorServiceModel.unitsAvailable < this.eventGuestNum) {
          this.reservationForm.controls["numberReserved"].setValue(this.vendorServiceModel.unitsAvailable)
          message = 'This vendor cannot accomodate all of your guests with this service. Units Requested has been set to the units available.';
          this.snackbar.open(message, '', {
            duration: 5000
          });
        }
        else {
          this.reservationForm.controls["numberReserved"].setValue(this.eventGuestNum)
        }
      }
    }, (error) => {
      if (error.status === 404) {
        this.reservationForm.controls["numberReserved"].setValue(0)
        error = {
          error: {
            description: null
          }
        };
      }
      message = error.error.description || 'You have no guest list. We recommend adding a guest list.';

      this.snackbar.open(message, '', {
        duration: 5000
      });
    });
  }

  subscribeEventChoice() {
    this.reservationForm.controls['eventList'].valueChanges.subscribe(
      (value) => {
        if (value) {
          this.eventService.getEvent(value).subscribe(response => {
            this.eventModel = response
            this.getNumGuests(value)
          });
        }
      });
  }

  subscribeCost() {
    this.reservationForm.controls['numberReserved'].valueChanges.subscribe(
      (value) => {
        if (value) {
          if (this.vendorServiceModel != null) {
            if (this.vendorServiceModel.flatFee == true) {
              this.cost = this.vendorServiceModel.price
            }
            else {
              this.cost = this.vendorServiceModel.price * value
            }
          }
        } else {
          this.cost = 0.00
        }
      });
  }

  onCancel() {
    this.location.back();
  }

  onCreate(): void {
    const res: Reservation = {
      id: null,
      userName: this.userName,
      eventId: this.eventModel.guid,
      vendorId: this.vendorServiceModel.vendorId,
      vendorServiceId: this.vendorServiceModel.id,
      status: "New",
      numberReserved: this.reservationForm.controls['numberReserved'].value,
      vendorService: null,
      event: null,
      vendor: null
    };

    let alreadyReserved = false;
    this.reservationService.getReservationsByEventGuid(this.eventModel.guid).subscribe(response => {
      if(response != null){
        let existing =  response.find(x => x.vendorService.serviceType == this.vendorServiceModel.serviceType);
        if(existing){
          this.snackbar.open('You already have ' + this.vendorServiceModel.serviceType + ' reserved for this event. Choose another event or service.', 'Failed', {
            duration: 3500
          });
        }
        else{

          this.reservationService.createReservation(res).subscribe(response => {
            this.ngOnInit();
            this.reservationForm.reset();
            this.snackbar.open('Your reservation has been requested.', 'Created', {
              duration: 1500
            });
      
            const emailModel: EmailModel = this.emailService.createEmailModel('Reservation Requested', 'Reservation Requested', this.userName);
            this.emailService.sendReservationEmailNotification(response.id, emailModel).subscribe(emailResponse => {
              this.snackbar.open('Your vendor has been notified.', 'Notified', {
                duration: 1500
              });
            }, error => {
              this.snackbar.open('Your reservation has been requested, but the Vendor was unable to be notified via Email.', 'Failed', {
                duration: 1500
              });
            });
      
          }, error => {
            console.log(error);
            this.snackbar.open('Failed to create reservation request.', 'Failed', {
              duration: 3500
            });
          });

        }
      }
    });
  }

  getMaxNumberErrorMessage() {
    let val = this.reservationForm.controls['numberReserved'].value;
    if (val == '0') {
      return "Must be greater than 0"
    }
    else if (val > this.vendorServiceModel.unitsAvailable) {
      return "Must be " + this.vendorServiceModel.unitsAvailable + " or less";
    }
  }

}
