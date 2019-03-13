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
  eventList: []

  reservationForm = new FormGroup({
    eventList: new FormControl('', [ Validators.required ]),
  });

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private emailService: EmailService,
    private vendorServicesService: VendorServicesService,
    private eventService: EventService
    ) {
  }

  ngOnInit() {
    this.setUser();
    this.setVendorService();
    this.getUserEvents();
  }

  setUser()
  {
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
      if(this.userEvents.length == 1){
        this.eventModel = this.userEvents[0];        
      }
      if(this.userEvents.length > 1){
        this.subscribeEventChoice();
      }
    });
    
  }

  subscribeEventChoice(){
    this.reservationForm.controls['eventList'].valueChanges.subscribe(
      (value) => {
        if (value) {
          this.eventService.getEvent(value).subscribe(response => {
            this.eventModel = response
       });
      }
    });
  }

}
