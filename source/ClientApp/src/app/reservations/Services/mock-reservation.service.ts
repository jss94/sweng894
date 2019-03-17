import { Injectable} from '@angular/core';
import { Reservation } from '../Models/reservation.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockReservationService {

    getReservations(): Observable<Reservation[]> {
        return of(null);
      }
    
    createReservation(res: Reservation): Observable<any> {
        return of(null);
      }

    updateReservation(res: Reservation): Observable<any> {
        return of(null);
      }
    
    cancelReservation(res: Reservation): Observable<any> {
        return of(null);
      }
    
    getReservationByVendorId(id?: number): Observable<Reservation[]> {
        return of(null);
      }
    
    getReservationByUsername(userName: string): Observable<Reservation> {
        return of(null);
      }
    
    getReservationById(id?: number): Observable<Reservation> {
        return of(null);
      }
    
    getReservationStatusList(): Observable<string>{
        return of(null);
      }
}