
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthService {
  userProfile: any = {};

  public getUserProfile(): any {
    return this.userProfile;
  }
}
