
import { Observable, of, ObjectUnsubscribedError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FakeUser } from '../models/fake-user.model';
import { User } from '../models/user.model';

@Injectable()
export class MockAuthService {

  user: User = new FakeUser();
  _user$: Observable<User> = of(new FakeUser());

  get user$() {
    return this._user$;
  }

  userProfile: any = {};

  isAuthenticated(): any {
    return null;
  }

  getUserProfile(): any {
    return this.userProfile;
  }

  login(): any {
    return undefined;
  }

  get(): Observable<any> {
    return of(null);
  }

  put(): Observable<any> {
    return of(null);
  }

  post(): Observable<any> {
    return of(null);
  }

  delete(): Observable<any> {
    return of(null);
  }

}
