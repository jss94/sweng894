
import { Observable, of } from 'rxjs';
import { Event } from '../Models/event.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MockEventService {
    getEvents(): Observable<Event[]> {
        return of(null);
    }
}
