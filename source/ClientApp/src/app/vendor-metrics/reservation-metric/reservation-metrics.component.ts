import { Component, OnInit, Input } from '@angular/core';
import { VendorMetricService } from '../Service/vendor-metric.service';
import { MonthlyMetric } from './Model/monthly-metric.model';
import { MonthlyMetricChartData } from './Model/monthly-metric-chart-data';
import { ViewEncapsulation } from '@angular/core';
import { WeekdayMetric } from './Model/weekday-metric.model';
import { WeekdayMetricChartData } from './Model/weekday-metric-chart-data';
import { WeekdaySalesMetric } from './Model/weekday-sales-metric.model';
import { MonthlySalesMetric } from './Model/monthly-sales-metric.model';

@Component({
  selector: 'app-reservation-metrics',
  templateUrl: './reservation-metrics.component.html',
  styleUrls: ['./reservation-metrics.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class ReservationMetricsComponent implements OnInit {

  @Input() vendorId;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() dateFormat;
  @Input() type;

  chartData: any;

  view: any[] = [650, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private metricsService: VendorMetricService
  ) {}

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

    if (this.type === 'Reservations') {
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
    } else if (this.type === 'Sales') {
        if (this.dateFormat === 'Weekday') {
          this.metricsService.getWeekdayReservationSalesMetrics(this.vendorId).subscribe(response => {
            let weekdayMetric: WeekdaySalesMetric[];
            weekdayMetric = response;
         //   this.calculateSalesMetric(weekdayMetric);
            weekdayMetric.forEach(metric => {
             // this.chartData.data.push({ name: metric.weekday, value: metric.reservationCount });
            });
            this.chartData.data = [...this.chartData.data];
          }, error => {
            console.log(error);
          });
        } else if (this.dateFormat === 'Monthly') {
          this.metricsService.getMonthlyReservationSalesMetrics(this.vendorId).subscribe(response => {
            let monthlyMetric: MonthlySalesMetric[];
            monthlyMetric = response;
            monthlyMetric.forEach(metric => {
            //  this.chartData.data.push({ name: metric.month, value: metric.reservationCount });
            });
            this.chartData.data = [...this.chartData.data];
          }, error => {
            console.log(error);
          });
        }
    }
  }
}
