import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../Models/vendor.model';
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
}
