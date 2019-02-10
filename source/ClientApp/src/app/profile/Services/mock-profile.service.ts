
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { Vendor } from 'src/app/vendors/Models/vendor.model';

@Injectable()
export class MockProfileService {
    get(): Observable<[User, Vendor]> {
        return of(null);
    }

    update(user: User, vendor?: Vendor): Observable<boolean> {
      return of(null);
    }
}
