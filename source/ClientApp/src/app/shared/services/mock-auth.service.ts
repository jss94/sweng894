
import { Observable, of, ObjectUnsubscribedError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FakeUser } from '../models/fake-user.model';
import { User } from '../models/user.model';

@Injectable()
export class MockAuthService {

  _user: User = new FakeUser();
  _user$: Observable<User> = of(new FakeUser());

  get user(): User {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  isAuthenticated(): any {
    return null;
  }

  getUserProfile(): any {
    return {};
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
