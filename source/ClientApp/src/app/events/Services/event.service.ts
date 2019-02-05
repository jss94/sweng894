import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Event } from '../Models/event.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class EventService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getEvents(id: string): Observable<Event[]> {
      return this.auth.authGet('event/' + id);
  }

  createNewEvent(evt: Event): Observable<Object> {
    return this.auth.authPost('event/', evt);
  }


  updateEvent(evnt: Event): Observable<Object> {
    return this.auth.authPut('event/', evnt);
  }

  deleteEvent(evnt: Event): Observable<Object> {
    return this.auth.authDelete('event/', evnt);
  }

}
