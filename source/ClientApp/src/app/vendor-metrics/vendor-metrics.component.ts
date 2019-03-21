import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  yAxisSalesLabel = 'Sales';
  yAxisReservationsLabel = 'Reservations';
  saleType = 'Sales';
  reservationType = 'Reservations';

  constructor(
    private route: ActivatedRoute,
  ) {}

ngOnInit() {
  // no-op
  this.getMetrics();
  }

  getMetrics() {
    this.route.paramMap.subscribe(() => {
     // const vendorId = + params.get('vendorId');
       this.vendorId = 35; // replaceWithVendorId
    });
  }

}
