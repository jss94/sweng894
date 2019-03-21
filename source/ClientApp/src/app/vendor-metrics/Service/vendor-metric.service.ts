import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MonthlyMetric } from '../reservation-metric/Model/monthly-metric.model';
import { WeekdayMetric } from '../reservation-metric/Model/weekday-metric.model';
import { MonthlySalesMetric } from '../reservation-metric/Model/monthly-sales-metric.model';
import { WeekdaySalesMetric } from '../reservation-metric/Model/weekday-sales-metric.model';

@Injectable()
export class VendorMetricService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getMonthlyReservationCountMetrics(id: number): Observable<MonthlyMetric[]> {
      return this.auth.get('vendorMetrics/reservations/count/monthly/' + id);
  }


  getWeekdayReservationCountMetrics(id: number): Observable<WeekdayMetric[]> {
    return this.auth.get('vendorMetrics/reservations/count/weekday/' + id);
  }

  getMonthlyReservationSalesMetrics(id: number): Observable<MonthlySalesMetric[]> {
    return this.auth.get('vendorMetrics/reservations/sales/monthly/' + id);
}


getWeekdayReservationSalesMetrics(id: number): Observable<WeekdaySalesMetric[]> {
  return this.auth.get('vendorMetrics/reservations/sales/weekday/' + id);
}
}
