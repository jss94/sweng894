import { Observable, of } from 'rxjs';
import { Vendor } from '../../shared/models/vendor.model';
import { Injectable } from '@angular/core';
import { FavoriteVendor } from '../Models/favorite-vendor.model';

@Injectable()
export class MockFavoriteVendorService {
    isVendorAFavorite(fav: FavoriteVendor): Observable<boolean> {
      return of(true);
    }
    deleteFavoriteVendor(fav: FavoriteVendor): Observable<any> {
      return of(null);
    }
    addNewFavoriteVendor(fav: FavoriteVendor): Observable<any> {
      return of(null);
    }
    getFavoriteVendors(userName: string): Observable<Vendor[]> {
      return of(null);
    }
  }