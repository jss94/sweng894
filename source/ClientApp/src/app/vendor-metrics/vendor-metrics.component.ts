import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { VendorService } from '../vendors/Services/vendor.service';

@Component({
  selector: 'app-vendor-metrics',
  templateUrl: './vendor-metrics.component.html',
  styleUrls: ['./vendor-metrics.component.css']
})
export class VendorMetricsComponent implements OnInit {

  vendorId: any;
  weekdayDateFormat = 'Weekday';
  monthlyDateFormat = 'Monthly';
  xAxisMonthLabel = 'Month';
  xAxisWeekdayLabel = 'Weekday';
  yAxisSalesLabel = 'Sales $';
  yAxisReservationsLabel = 'Reservation Count';
  saleType = 'Sales';
  reservationType = 'Count';
  // Declaring the Promise, yes! Promise!
  vendorIdLoaded: Promise<boolean>;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private vendorService: VendorService,
  ) { }

  ngOnInit() {
    // no-op
    this.getMetrics();
  }

  getMetrics() {

    const user = this.auth.user;
    if (user) {
      this.vendorService.getVendor(user.userName).subscribe((vendor) => {
        this.vendorId = vendor.id;
        this.vendorIdLoaded = Promise.resolve(true);
      });
    } else {
      this.auth.user$.subscribe((result) => {
        this.vendorService.getVendor(result.userName).subscribe((vendor) => {
          console.log('FOUND MY VENDOR2' + vendor.id);
          this.vendorId = vendor.id;
          this.vendorIdLoaded = Promise.resolve(true);
        });
      });
    }


  }
}
