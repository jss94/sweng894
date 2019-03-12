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
      debugger
      this.userName = this.auth.user.userName;
    } else {
      debugger
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
    debugger
    this.eventService.getEvents(this.userName).subscribe(response => {
      this.userEvents = response
      debugger
    });
    
  }

}
