
import { Observable, of } from 'rxjs';
import { Vendor } from '../../shared/models/vendor.model';
import { Injectable } from '@angular/core';
import { FakeVendor } from 'src/app/shared/models/fake-vendor.model';

@Injectable()
export class MockVendorService {
    getVendors(): Observable<Vendor[]> {
        return of(null);
    }

    getVendor(username: string): Observable<Vendor> {
        return of(null);
    }

    getVendorById(id: number): Observable<Vendor> {
        const fakeVendor = new FakeVendor();
        return of(fakeVendor);
    }
}
