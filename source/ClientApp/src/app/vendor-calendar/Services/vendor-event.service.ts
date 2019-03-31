import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VendorEvent } from '../Model/vendor-event.model';

@Injectable()
export class VendorEventService {
  constructor(
      private auth: AuthService,
      ) {
  }

  getVendorEvents(id: number): Observable<VendorEvent[]> {
      return this.auth.get('VendorEvents/' + id);
  }
}
