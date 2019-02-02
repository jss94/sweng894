
import { Observable, of } from 'rxjs';
import { Event } from '../Models/event.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MockEventService {
    getEvents(organizerId: string): Observable<Event[]> {
        return of(null);
    }

    createNewEvent(evnt: Event): Observable<Event> {
      return of(null);
    }
}
