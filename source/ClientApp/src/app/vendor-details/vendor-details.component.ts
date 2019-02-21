import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { VendorServicesService } from '../vendor-services/Services/vendor-services.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  
  vendor: Vendor;
  vendorServices: VendorServices[];
  vendorId = 0;
  userName: string;
  address: Address;
  
  constructor(
    private auth: AuthService,
    private vendorServicesService: VendorServicesService,
    private vendorService: VendorService,
    private router: Router,
    ) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.userName = this.auth.user.userName;
      this.vendorService.getVendor(this.userName).subscribe(vendor => {
        this.vendor = vendor;
        this.address = vendor.address;
        this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
          this.vendorServices = response;
        });
      });

    } else {
      this.auth.user$.subscribe((result) => {
        this.userName = result.userName;
        this.vendorService.getVendor(this.userName).subscribe(vendor => {
          this.vendor = vendor;
          this.address = vendor.address;
          this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
            this.vendorServices = response;
          });
        });
      });
    }
  }
  
}