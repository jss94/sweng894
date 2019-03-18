import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';

@Injectable()
export class VendorSearchService {
  constructor(
      private auth: AuthService,
      ) {
  }

  searchVendorServices(properties: any): Observable<VendorServices[]> {
    return this.auth.post('vendorservices/search', properties);
  }

}
