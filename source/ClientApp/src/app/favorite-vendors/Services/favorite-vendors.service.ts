import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { FavoriteVendor } from '../Models/favorite-vendor.model';
import { Vendor } from '../../shared/models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteVendorsService {

  constructor(private auth: AuthService) {  }

  getFavoriteVendors(userName: string): Observable<Vendor[]> {
    return this.auth.get('favorites/' + userName);
  }

  addNewFavoriteVendor(fav: FavoriteVendor): Observable<any> {
    return this.auth.post('favorites/', fav);
  }

  // AML: Remember to change this in the backend
  deleteFavoriteVendor(fav: FavoriteVendor): Observable<any> {
    return this.auth.delete('favorites/' + fav.userName + '/' + fav.vendorId);
  }

  isVendorAFavorite(fav: FavoriteVendor): Observable<boolean> {
    return this.auth.get('favorites/' + fav.userName + '/' + fav.vendorId);
  }
}
