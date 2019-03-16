import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MonthlyMetric } from '../Model/monthly-metric.model';

@Injectable()
export class VendorMetricService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getMonthlyMetrics(id: number): Observable<MonthlyMetric[]> {
      return this.auth.get('vendorMetrics/' + id);
  }

}
