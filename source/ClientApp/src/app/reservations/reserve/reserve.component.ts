import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute, ParamMap, Event } from '@angular/router';
import { EmailService } from '../../send-email/Services/email.service';
import { EmailDialogComponent } from '../../shared/components/email-dialog/email-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { EmailModel } from '../../send-email/Models/email.model';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
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
  eventId: string
  userName: string
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
    if (this.auth.user) {
      this.userName = this.auth.user.userName;
    }
    else {
      this.auth.user$.subscribe((result) => { this.userName = result.userName; });
    }

    this.setVendorService();
    this.setEvent();
  }

  setVendorService() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const svcId = +params.get('vendorServiceId');
      this.vendorServicesService.getVendorServiceById(svcId).subscribe(response => {
          this.vendorServiceModel = response;
        });
      }, error => {
        console.log(error);
      });
  }

  setEvent() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      //This needs help - how do we get events for a user now?
      const evntId = +params.get('guid');
      this.eventService.getEvent(evntId.toString()).subscribe(response => {
          this.eventModel = response;
        });
      }, error => {
        //present event choides
        this.eventService.getEvents(this.userName);
        console.log(error);
      });
  }

}
