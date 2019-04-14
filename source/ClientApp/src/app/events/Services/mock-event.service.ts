
import { Observable, of } from 'rxjs';
import { OccEvent } from '../Models/occ-event.model';
import { Injectable } from '@angular/core';
import { FakeOccEvent } from '../Models/fake-occ-event.model';

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

  updateEvent(evnt: OccEvent): Observable<boolean> {
    return of(undefined);
  }

  deleteEvent(evnt: OccEvent): Observable<OccEvent> {
    return of(new FakeOccEvent());
  }
}
