import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VendorMetricService } from './Service/vendor-metric.service';
import { MonthlyMetric } from './Model/monthly-metric.model';
import { MonthlyMetricChartData } from './Model/monthly-metric-chart-data';

@Component({
  selector: 'app-vendor-metrics',
  templateUrl: './vendor-metrics.component.html',
  styleUrls: ['./vendor-metrics.component.css']
})
export class VendorMetricsComponent implements OnInit {

  monthlyMetric: MonthlyMetric[];

  chartData: MonthlyMetricChartData;

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Reservations';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private metricsService: VendorMetricService,
    private route: ActivatedRoute,
  ) {
    this.chartData = new MonthlyMetricChartData();
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
      const testId = 35; // replaceWithVendorId
      this.metricsService.getMonthlyMetrics(testId).subscribe(response => {
        this.monthlyMetric = response;
        this.monthlyMetric.forEach(metric => {
          this.chartData.data.push({ name: metric.month, value: metric.reservationCount });
        });
        this.chartData.data = [...this.chartData.data];
      }, error => {
        console.log(error);
      });
    });
  }


}
