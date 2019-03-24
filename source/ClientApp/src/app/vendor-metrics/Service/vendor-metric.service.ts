import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReservationCountMetric } from '../reservation-metric/Model/reservation-count-metric.model';
import { ReservationSalesMetric } from '../reservation-metric/Model/reservation-sales-metric.model';

@Injectable()
export class VendorMetricService {
  constructor(
      private auth: AuthService,
      ) {
  }

  getMonthlyReservationCountMetrics(id: number): Observable<ReservationCountMetric[]> {
      return this.auth.get('vendorMetrics/reservations/count/monthly/' + id);
  }


  getWeekdayReservationCountMetrics(id: number): Observable<ReservationCountMetric[]> {
    return this.auth.get('vendorMetrics/reservations/count/weekday/' + id);
  }

  getMonthlyReservationSalesMetrics(id: number): Observable<ReservationSalesMetric[]> {
    return this.auth.get('vendorMetrics/reservations/sales/monthly/' + id);
}


getWeekdayReservationSalesMetrics(id: number): Observable<ReservationSalesMetric[]> {
  return this.auth.get('vendorMetrics/reservations/sales/weekday/' + id);
}
}
