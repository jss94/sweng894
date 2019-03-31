import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Reservation } from '../Models/reservation.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class ReservationsService {
  constructor(
      private auth: AuthService,
      ) {
  }

  getReservations(): Observable<Reservation[]> {
    return this.auth.get('reservations');
  }

  createReservation(res: Reservation): Observable<any> {
  return this.auth.post('reservations/', res);
  }

  updateReservation(res: Reservation): Observable<any> {
    return this.auth.put('reservations/', res);
  }

  deleteReservation(res: Reservation): Observable<any> {
    return this.auth.delete('reservations/' + res.id);
  }

  getReservationByVendorId(id?: number): Observable<Reservation[]> {
    return this.auth.get('reservations/vendor/' + id);
  }

  getReservationByUsername(userName: string): Observable<Reservation> {
    return this.auth.get('reservations/user/' + userName);
  }

  getReservationById(id?: number): Observable<Reservation> {
    return this.auth.get('reservations/' + id);
  }

  getReservationStatusList(): Observable<string>{
    return this.auth.get('reservations/statusTypes');
  }

  getReservationsByEventGuid(guid: string): Observable<Reservation[]>{
    return this.auth.get('reservations/event/' + guid)
  }

}