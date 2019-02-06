import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OccEvent } from '../Models/occ-event.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class EventService {
  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  getEvents(id: string): Observable<OccEvent[]> {
      return this.auth.get('event/' + id);
  }

  createNewEvent(evt: OccEvent): Observable<any> {
    return this.auth.post('event/', evt);
  }


  updateEvent(evnt: OccEvent): Observable<any> {
    return this.auth.put('event/', evnt);
  }

  deleteEvent(evnt: OccEvent): Observable<any> {
    return this.auth.delete('event/' + evnt.eventId);
  }

}
