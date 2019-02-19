import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vendor } from 'src/app/shared/models/vendor.model';

@Injectable()
export class UserProfileService {
  constructor(
      private auth: AuthService,
      ) {
  }

  getVendor(userName: string): Observable<Vendor> {
    return this.auth.get('vendors/' + userName);
  }

  getOrganizer(userName: string): Observable<User> {
    return this.auth.get('users/' + userName);
  }

  updateVendor(user: User, vendor: Vendor): Observable<boolean> {
    return forkJoin(
      this.auth.put('users', user),
      this.auth.put('vendors', vendor)
    ).pipe(
      map(([didUser, didVendor]) => {
        return didUser && didVendor;
      })
    );
  }

  updateOrganizer(user: User): Observable<boolean> {
    return this.auth.put('users', user);
  }
}
