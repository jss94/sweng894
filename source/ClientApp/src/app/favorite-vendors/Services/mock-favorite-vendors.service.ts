import { Observable, of } from 'rxjs';
import { Vendor } from '../../shared/models/vendor.model';
import { Injectable } from '@angular/core';

@Injectable()
export class MockFavoriteVendorService {
    isVendorAFavorite(): Observable<boolean> {
      return of(true);
    }
    deleteFavoriteVendor(): Observable<any> {
      return of(null);
    }
    addNewFavoriteVendor(): Observable<any> {
      return of(null);
    }
    getFavoriteVendors(): Observable<Vendor[]> {
      return of(null);
    }
  }