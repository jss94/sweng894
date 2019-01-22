import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../Models/vendor.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class VendorService {
    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {
    }

    getVendors(): Observable<Vendor[]> {
      return this.http.get<Vendor[]>(this.baseUrl + 'api/Vendors');
    }
}
