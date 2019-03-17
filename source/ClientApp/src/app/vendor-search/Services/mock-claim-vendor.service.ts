
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MockClaimVendorService {
    searchVendorServices() {
        return of(null);
    }
}
