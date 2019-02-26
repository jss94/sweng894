
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MockVendorSearchService {
    searchVendorServices() {
        return of(null);
    }
}
