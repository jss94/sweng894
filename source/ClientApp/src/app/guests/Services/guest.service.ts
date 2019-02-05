import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Guest } from '../Models/guest.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class GuestService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getGuests(id: string): Observable<Guest[]> {
    return this.auth.authGet('guest/' + id);
  }
}
