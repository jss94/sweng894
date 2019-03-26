import { Component, OnInit, Input } from '@angular/core';
import { VendorEventService } from './Services/vendor-event.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-vendor-calendar',
  templateUrl: './vendor-calendar.component.html',
  styleUrls: ['./vendor-calendar.component.css']
})
export class VendorCalendarComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private vendorEventsService: VendorEventService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
        const vendorId = +params.get('vendorId');
        this.vendorEventsService.getVendorEvents(vendorId).subscribe(vendorEvents => {
          console.log('Response:' + JSON.stringify(vendorEvents));
        });
      }, error => {
        console.log(error);
      });
  }
}
