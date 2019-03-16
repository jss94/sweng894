import { Component, OnInit, Input } from '@angular/core';
import { VendorMetricService } from '../Service/vendor-metric.service';
import { MonthlyMetric } from './Model/monthly-metric.model';
import { MonthlyMetricChartData } from './Model/monthly-metric-chart-data';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-monthly-reservation-count-metrics',
  templateUrl: './monthly-reservation-count-metrics.component.html',
  styleUrls: ['./monthly-reservation-count-metrics.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class MonthlyReservationCountMetricsComponent implements OnInit {

  @Input() vendorId;

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
    private metricsService: VendorMetricService
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
    this.metricsService.getMonthlyMetrics(this.vendorId).subscribe(response => {
        this.monthlyMetric = response;
        this.monthlyMetric.forEach(metric => {
          this.chartData.data.push({ name: metric.month, value: metric.reservationCount });
        });
        this.chartData.data = [...this.chartData.data];
      }, error => {
        console.log(error);
      });
  }


}
