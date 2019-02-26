import { Injectable, Inject } from '@angular/core';
import { Vendor } from '../../shared/models/vendor.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class VendorService {

    constructor(
        private auth: AuthService,
    ) {
    }

    getVendors(): Observable<Vendor[]> {
        return this.auth.get('vendors');
    }

    getVendor(userName: string): Observable<Vendor> {
        return this.auth.get('vendors/' + userName);
    }

    getVendorById(vendorId: number): Observable<Vendor> {
        return this.auth.get('vendors/id/' + vendorId);
    }
}
