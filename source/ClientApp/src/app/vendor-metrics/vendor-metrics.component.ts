import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VendorMetricService } from './Service/vendor-metric.service';

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
