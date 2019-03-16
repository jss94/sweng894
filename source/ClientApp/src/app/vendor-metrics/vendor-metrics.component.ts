import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VendorMetricService } from './Service/vendor-metric.service';
import { MonthlyMetric } from './Model/monthly-metric.model';

@Component({
  selector: 'app-vendor-metrics',
  templateUrl: './vendor-metrics.component.html',
  styleUrls: ['./vendor-metrics.component.css']
})
export class VendorMetricsComponent implements OnInit {

  monthlyMetric: MonthlyMetric[];

  chartData: any[] =
  [
    {
      "name": "January",
      "value": 0
    },
    {
      "name": "February",
      "value": 0
    },
    {
      "name": "March",
      "value": 0
    }
  ];

  view: any[] = [300, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Count';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private metricsService: VendorMetricService,
    private route: ActivatedRoute,
  ) {
    // https://stackblitz.com/edit/vertical-bar-chart?embed=1&file=app/app.component.ts
    Object.assign(this.chartData);
  }

  ngOnInit() {
    this.getMetrics();
  }


  onSelect(event) {
    console.log(event);
  }


  getMetrics() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const vendorId = + params.get('vendorId');
      const testId = 1; // replaceWithVendorId
      this.metricsService.getMonthlyMetrics(testId).subscribe(response => {
        this.monthlyMetric = response;
        console.log(this.monthlyMetric);
        this.chartData.push({ name: 'January', value: 1 });
        this.chartData.push({ name: 'March', value: 3 });
        this.chartData = [...this.chartData];
      }, error => {
        console.log(error);
      });
    });
  }


}
