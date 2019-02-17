import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';

@Injectable({
  providedIn: 'root'
})
export class VendorServicesService {

  constructor(
    private auth: AuthService,
    ) {   }

    getVendorServices(id: number): Observable<VendorServices[]> {
      return this.auth.get('vendorServices/vendor/' + id);
    }

    createNewVendorService(svc: VendorServices): Observable<any> {
      return this.auth.post('vendorServices/', svc);
    }

    updateVendorService(svc: VendorServices): Observable<any> {
      return this.auth.put('vendorServices/', svc);
    }

    deleteVendorService(svc: VendorServices): Observable<any> {
      return this.auth.delete('vendorServices/' + svc.id);
    }

    getVendorServiceById(id?: number): Observable<VendorServices> {
      return this.auth.get('vendorServices/id/' + id);
    }

}
