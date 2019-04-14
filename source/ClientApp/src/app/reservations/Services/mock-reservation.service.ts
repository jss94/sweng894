import { Injectable } from '@angular/core';
import { Reservation } from '../Models/reservation.model';
import { Observable, of } from 'rxjs';
import { FakeReservation } from '../Models/fake-reservation.model';

@Injectable()
export class MockReservationService {

  getReservations(): Observable<Reservation[]> {
    return of(undefined);
  }

  createReservation(res: Reservation): Observable<any> {
    return of(undefined);
  }

  updateReservation(res: Reservation): Observable<any> {
    return of(undefined);
  }

  deleteReservation(res: Reservation): Observable<any> {
    return of(undefined);
  }

  getReservationByVendorId(id: number): Observable<Reservation[]> {
    return of(undefined);
  }

  getReservationByUsername(userName: string): Observable<Reservation> {
    return of(undefined);
  }

  getReservationById(id: number): Observable<Reservation> {
    return of(new FakeReservation());
  }

  getReservationStatusList(): Observable<string> {
    return of(undefined);
  }

  getReservationsByEventGuid(guid: string): Observable<Reservation[]> {
    return of(undefined);
  }
}