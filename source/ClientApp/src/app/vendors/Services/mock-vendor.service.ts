
import { Observable, of } from 'rxjs';
import { Vendor } from '../../shared/models/vendor.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MockVendorService {
    getVendors(): Observable<Vendor[]> {
        return of(null);
    }

    getVendor(id: number): Observable<Vendor> {
        return of(null);
    }
}
