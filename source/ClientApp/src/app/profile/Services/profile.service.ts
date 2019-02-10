import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { Vendor } from 'src/app/vendors/Models/vendor.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileService {
  constructor(
      private auth: AuthService,
      ) {
  }

  get(userName: string): Observable<[User, Vendor]> {
      return forkJoin(
        this.auth.get('users/' + userName),
        this.auth.get('vendors/' + userName)
    );

  }

  update(user: User, vendor?: Vendor): Observable<[boolean]> {
    if (vendor) {
      return forkJoin(
        this.auth.put('users', user),
        this.auth.put('vendors', vendor)
      ).pipe(
        map(([didUser, didVendor]) => {
          return didUser && didVendor;
        })
      );
    } else {
      return this.auth.put('users', user);
    }
  }
}
