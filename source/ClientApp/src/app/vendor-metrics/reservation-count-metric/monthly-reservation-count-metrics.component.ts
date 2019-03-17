import { Component, OnInit, Input } from '@angular/core';
import { VendorMetricService } from '../Service/vendor-metric.service';
import { MonthlyMetric } from './Model/monthly-metric.model';
import { MonthlyMetricChartData } from './Model/monthly-metric-chart-data';
import { ViewEncapsulation } from '@angular/core';
import { WeekdayMetric } from './Model/weekday-metric.model';
import { WeekdayMetricChartData } from './Model/weekday-metric-chart-data';

@Component({
  selector: 'app-monthly-reservation-count-metrics',
  templateUrl: './monthly-reservation-count-metrics.component.html',
  styleUrls: ['./monthly-reservation-count-metrics.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class MonthlyReservationCountMetricsComponent implements OnInit {

  @Input() vendorId;
  @Input() xAxisLabel;
  @Input() dateFormat;

  chartData: any;

  view: any[] = [650, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  yAxisLabel = 'Reservations';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private metricsService: VendorMetricService
  ) {

  }

  ngOnInit() {
    if (this.dateFormat === 'Monthly') {
      this.chartData = new MonthlyMetricChartData();
    } else if (this.dateFormat === 'Weekday') {
      this.chartData = new WeekdayMetricChartData();
    }
    Object.assign(this.chartData);
    this.getMetrics();
  }

  onSelect(event) {
    console.log(event);
  }

  getMetrics() {
    if (this.dateFormat === 'Weekday') {
      this.metricsService.getWeekdayReservationCountMetrics(this.vendorId).subscribe(response => {
        let weekdayMetric: WeekdayMetric[];
        weekdayMetric = response;
        weekdayMetric.forEach(metric => {
          this.chartData.data.push({ name: metric.weekday, value: metric.reservationCount });
        });
        this.chartData.data = [...this.chartData.data];
      }, error => {
        console.log(error);
      });
    } else if (this.dateFormat === 'Monthly') {
      this.metricsService.getMonthlyReservationCountMetrics(this.vendorId).subscribe(response => {
        let monthlyMetric: MonthlyMetric[];
        monthlyMetric = response;
        monthlyMetric.forEach(metric => {
          this.chartData.data.push({ name: metric.month, value: metric.reservationCount });
        });
        this.chartData.data = [...this.chartData.data];
      }, error => {
        console.log(error);
      });
    }
  }
}
