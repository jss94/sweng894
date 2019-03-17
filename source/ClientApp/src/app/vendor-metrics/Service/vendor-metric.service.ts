import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MonthlyMetric } from '../reservation-count-metric/Model/monthly-metric.model';
import { WeekdayMetric } from '../reservation-count-metric/Model/weekday-metric.model';

@Injectable()
export class VendorMetricService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getMonthlyReservationCountMetrics(id: number): Observable<MonthlyMetric[]> {
      return this.auth.get('vendorMetrics/reservations/monthly/' + id);
  }


  getWeekdayReservationCountMetrics(id: number): Observable<WeekdayMetric[]> {
    return this.auth.get('vendorMetrics/reservations/weekday/' + id);
  }
}
