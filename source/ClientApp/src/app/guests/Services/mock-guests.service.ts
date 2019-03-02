import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Guest } from '../Models/guest.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class MockGuestsService {
  constructor(
      ) {
  }

  getGuests(id: string): Observable<Guest[]> {
    return of(null);
  }

  insert(guest: Guest): Observable<boolean> {
    return of(null);
  }
}
