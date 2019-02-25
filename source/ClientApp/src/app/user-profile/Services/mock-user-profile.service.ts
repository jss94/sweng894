
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { Vendor } from 'src/app/shared/models/vendor.model';

@Injectable()
export class MockUserProfileService {
    getVendor(): Observable<Vendor> {
      return of(null);
    }

    getOrganizer(): Observable<User> {
      return of(null);
    }

    updateVendor(user: User, vendor?: Vendor): Observable<boolean> {
      return of(null);
    }

    updateOrganizer(user: User): Observable<boolean> {
      return of(null);
    }
}

