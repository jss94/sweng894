import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VendorServiceModel } from '../Models/vendor-service.model';

@Injectable({
  providedIn: 'root'
})
export class VendorServicesService {

  constructor(
    private auth: AuthService,
    ) {   }

    getVendorServices(id: string): Observable<VendorServiceModel[]> {
      return this.auth.get('vendorServices/vendor/' + id);
    }

    createNewVendorService(svc: VendorServiceModel): Observable<any> {
      return this.auth.post('vendorServices/', svc);
    }

    updateVendorService(svc: VendorServiceModel): Observable<any> {
      return this.auth.put('vendorServices/', svc);
    }

    deleteEvent(svc: VendorServiceModel): Observable<any> {
      return this.auth.delete('vendorServices/' + svc.id);
    }

}
