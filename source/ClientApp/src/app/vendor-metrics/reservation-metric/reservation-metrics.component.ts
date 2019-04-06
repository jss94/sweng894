import { Component, OnInit, Input } from '@angular/core';
import { VendorMetricService } from '../Service/vendor-metric.service';
import { MonthlyMetricChartData } from './Model/monthly-metric-chart-data';
import { ViewEncapsulation } from '@angular/core';
import { WeekdayMetricChartData } from './Model/weekday-metric-chart-data';
import { ReservationCountMetric } from './Model/reservation-count-metric.model';
import { ReservationSalesMetric } from './Model/reservation-sales-metric.model';

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

  view: any[] = [600, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ['#3F51B5', '#3F51B5', '#3F51B5', '#3F51B5']
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

    if (this.type === 'Count') {
      if (this.dateFormat === 'Weekday') {
        this.metricsService.getWeekdayReservationCountMetrics(this.vendorId).subscribe(response => {
          this.populateChartWithReservationCountData(response);
        }, error => {
          console.log(error);
        });
      } else if (this.dateFormat === 'Monthly') {
        this.metricsService.getMonthlyReservationCountMetrics(this.vendorId).subscribe(response => {
          this.populateChartWithReservationCountData(response);
        }, error => {
          console.log(error);
        });
      }
    } else if (this.type === 'Sales') {
        if (this.dateFormat === 'Weekday') {
          this.metricsService.getWeekdayReservationSalesMetrics(this.vendorId).subscribe(response => {
              this.populateChartWithSalesData(response);
          }, error => {
            console.log(error);
          });
        } else if (this.dateFormat === 'Monthly') {
          this.metricsService.getMonthlyReservationSalesMetrics(this.vendorId).subscribe(response => {
              this.populateChartWithSalesData(response);
          }, error => {
            console.log(error);
          });
        }
    }
  }

  populateChartWithSalesData(metricSalesData: ReservationSalesMetric[]) {
    let reservationSalesMetric: ReservationSalesMetric[];
    reservationSalesMetric = metricSalesData;
    const metricData: Map<String, Number> = this.calculateSales(reservationSalesMetric);
    metricData.forEach((value: Number, key: string) => {
      this.chartData.data.push({ name: key, value: value });
    });
    this.chartData.data = [...this.chartData.data];
  }

  populateChartWithReservationCountData(reservationCountData: ReservationCountMetric[]) {
    let reservationCountMetric: ReservationCountMetric[];
    reservationCountMetric = reservationCountData;
    reservationCountMetric.forEach(metric => {
      this.chartData.data.push({ name: metric.dateCategory, value: metric.reservationCount });
    });
    this.chartData.data = [...this.chartData.data];
  }

  calculateSales(metricSalesData: ReservationSalesMetric[]) {
    const salesMetricMap = new Map();

    metricSalesData.forEach(saleData => {
      let cost = 0;

      if (saleData.flatFee) {
        cost = saleData.price;
      } else {
        cost = saleData.numberReserved * saleData.price;
      }

      if (salesMetricMap.get(saleData.dateCategory)) {
        const currentCost = salesMetricMap.get(saleData.dateCategory);
        salesMetricMap.set(saleData.dateCategory, (currentCost + cost));
      } else {
        salesMetricMap.set(saleData.dateCategory, cost);
      }
    });
    return salesMetricMap;
  }
}
