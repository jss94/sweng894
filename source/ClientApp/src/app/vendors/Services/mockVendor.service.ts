
import { Observable } from 'rxjs';
import { Vendor } from '../Models/vendor.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MockVendorService {
    getVendors(): Observable<Vendor[]> {
        return null;
    }
}
