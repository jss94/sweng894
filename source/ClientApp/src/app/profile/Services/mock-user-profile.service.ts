
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { Vendor } from 'src/app/shared/models/vendor.model';

@Injectable()
export class MockUserProfileService {
    get(): Observable<[User, Vendor]> {
        return of(null);
    }

    update(user: User, vendor?: Vendor): Observable<boolean> {
      return of(null);
    }
}

