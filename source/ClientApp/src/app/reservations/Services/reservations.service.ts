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

  cancelReservation(res: Reservation): Observable<any> {
    return this.auth.delete('reservation/' + res.id);
  }

  getReservationByVendorId(id?: number): Observable<Reservation[]> {
    return this.auth.get('reservation/vendor/' + id);
  }

  getReservationByUsername(userName: string): Observable<Reservation> {
    return this.auth.get('reservation/user/' + userName);
  }

  getReservationById(id?: number): Observable<Reservation> {
    return this.auth.get('reservation/' + id);
  }

  getReservationStatusList(): Observable<string>{
    return this.auth.get('reservation/statusTypes');
  }

  getReservationsByEventGuid(guid: string): Observable<Reservation[]>{
    return this.auth.get('reservation/event/' + guid)
  }

}