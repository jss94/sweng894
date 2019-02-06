import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { VendorService } from '../vendors/Services/vendor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private vendorService: VendorService,
    private router: Router
    ) {
    auth.handleAuthentication();

  }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      // Get any vendor information
      this.vendorService.getVendor(user.userName).subscribe((vendor) => {
        console.log('VENDOR', vendor);
        if (user && user.role === 'VENDOR' && vendor.id === null) {
          this.router.navigate(['/register-vendor']);
        } else {

          this.router.navigate(['/events']);
        }
      }, (error) => {

      });

    });

  }
}
