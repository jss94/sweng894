
import { Observable, of, ObjectUnsubscribedError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthService {
  userProfile: any = {};

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
