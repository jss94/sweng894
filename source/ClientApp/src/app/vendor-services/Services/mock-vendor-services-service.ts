import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Observable, of } from 'rxjs';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';

@Injectable()
export class MockVendorServicesService {
 
    getVendorServices(id: number): Observable<VendorServices[]> {
        return of(undefined);
      }
  
      createNewVendorService(svc: VendorServices): Observable<any> {
        return of(undefined);
      }
  
      updateVendorService(svc: VendorServices): Observable<any> {
        return of(undefined);
      }
  
      deleteVendorService(svc: VendorServices): Observable<any> {
        return of(undefined);
      }
  
      getVendorServiceById(id?: number): Observable<VendorServices> {
        return of(undefined);
      }
}
