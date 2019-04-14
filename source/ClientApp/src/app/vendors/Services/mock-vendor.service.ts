
import { Observable, of } from 'rxjs';
import { Vendor } from '../../shared/models/vendor.model';
import { FakeVendor } from 'src/app/shared/models/fake-vendor.model';

export class MockVendorService {
    getVendors(): Observable<Vendor[]> {
        return of(undefined);
    }

    getVendor(username: string): Observable<Vendor> {
        const fakeVendor = new FakeVendor();
        return of(fakeVendor);
    }

    getVendorById(id: number): Observable<Vendor> {
        const fakeVendor = new FakeVendor();
        return of(fakeVendor);
    }
}
