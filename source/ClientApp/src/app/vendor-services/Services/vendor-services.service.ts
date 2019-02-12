import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VendorService } from '../Models/vendor-service.model';

@Injectable({
  providedIn: 'root'
})
export class VendorServicesService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    ){   }
  
    getVendorServices(id: string): Observable<VendorService[]> {
      return this.auth.get('vendorServices/vendor/' + id);
    }

    createNewVendorService(svc: VendorService): Observable<any> {
      return this.auth.post('vendorServices/', svc);
    }

    updateVendorService(svc: VendorService): Observable<any> {
      return this.auth.put('vendorServices/', svc);
    }

    deleteEvent(svc: VendorService): Observable<any> {
      return this.auth.delete('vendorServices/' + svc.id);
    }

}