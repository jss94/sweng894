import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FavoriteVendorsService } from './Services/favorite-vendors.service';
import { Vendor } from '../shared/models/vendor.model';
import { User } from 'src/app/shared/models/user.model';
import { FavoriteVendor } from './Models/favorite-vendor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-vendors',
  templateUrl: './favorite-vendors.component.html',
  styleUrls: ['./favorite-vendors.component.css']
})
export class FavoriteVendorsComponent implements OnInit {
  public favoriteVendors: Vendor[];

  constructor(
    private favoriteVendorService: FavoriteVendorsService,
    private auth: AuthService,
    private router: Router
    ) {
  }

  ngOnInit() {
    const user = this.auth.user;
    if (user) {
      this.getFavoriteVendors(user);
    } else {
      this.auth.user$.subscribe((result) => {
        this.getFavoriteVendors(result);
      });
    }
  }

  getFavoriteVendors(user: User) {
    this.favoriteVendorService.getFavoriteVendors(user.userName).subscribe((response: Vendor[]) => {
      this.favoriteVendors = response;
    });
  }

  onDeleteFavorite(vendor: Vendor) {
    const favoriteToRemove: FavoriteVendor = {
      userName: this.auth.user.userName,
      vendorId: vendor.id
    };

    this.favoriteVendorService.deleteFavoriteVendor(favoriteToRemove).subscribe(() => {
      this.ngOnInit();
    });
  }

  onViewClicked(vendor: Vendor) {
    this.router.navigate(['vendor-details/' + vendor.id]);
  }

  onViewWebsite(vendor: Vendor) {
    let url = '';
    if (!/^http[s]?:\/\//.test(vendor.website)) {
        url += 'http://';
  }

    url += vendor.website;
    window.open(url, '_blank');
  }

}
