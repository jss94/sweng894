
import { Observable, of } from 'rxjs';
import { OccEvent } from '../Models/occ-event.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MockEventService {

  getEvent(userName: string, eventId: number): Observable<OccEvent> {
    return of(null);
  }

  getEvents(organizerId: string): Observable<OccEvent[]> {
    return of(null);
  }

  createNewEvent(evnt: OccEvent): Observable<OccEvent> {
    return of(null);
  }
}
