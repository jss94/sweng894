import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Guest } from '../Models/guest.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class GuestsService {
  constructor(
      private auth: AuthService,
      ) {
  }

  getGuests(id: string): Observable<Guest[]> {
    return this.auth.get('guest/event/' + id);
  }

  getGuest(id: string): Observable<Guest> {
    return this.auth.get('guest/' + id);
  }

  insert(guest: Guest): Observable<any> {
    return this.auth.post('guest/', guest);
  }

  update(guest: Guest): Observable<any> {
    return this.auth.put('guest/', guest);
  }

  delete(id: string): Observable<any> {
    return this.auth.delete('guest/' + id);
  }
}
