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

  reservationForm = new FormGroup({
    eventList: new FormControl('', [Validators.required]),
    numberReserved: new FormControl('', [Validators.required]),
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
        if(this.vendorServiceModel.flatFee != true && this.vendorServiceModel.unitsAvailable < this.eventGuestNum){
          this.reservationForm.controls["numberReserved"].setValue(this.vendorServiceModel.unitsAvailable)  
          message ='This vendor cannot accomodate all of your guests with this service. Units Requested has been set to the units available.';
          this.snackbar.open(message, '', {
            duration: 5000
          });   
          //TODO: SET MAX IN UNITS REQUESTED CONTROL TO MAX OF VENDOR OFFERINGS
        }
        else{
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
    this.ngOnInit();
  }

  onCreate(): void {
    const res: Reservation = {
      id: null,
      userName: this.userName,
    eventId: this.eventModel.guid,
    vendorId: this.vendorServiceModel.vendorId,
    vendorServiceId: this.vendorServiceModel.id,
    status: "New",
    numberReserved:  this.reservationForm.controls['numberReserved'].value,
    service: null,
    event: null,
    vendor: null
     };

    this.reservationService.createReservation(res).subscribe(response => {
      this.ngOnInit();
      this.reservationForm.reset();
      this.snackbar.open('Your reservation has been requested.', 'Created', {
        duration: 1500
      });
    }, error => {
      console.log(error);
      this.snackbar.open('Failed to create reservation request.', 'Failed', {
        duration: 3500
      });
    });
  }

}