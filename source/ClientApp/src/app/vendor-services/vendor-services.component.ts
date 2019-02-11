import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { VendorServicesService } from './Services/vendor-services.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServiceModel } from './Models/vendor-service.model';

@Component({
  selector: 'app-vendor-services',
  templateUrl: './vendor-services.component.html',
  styleUrls: ['./vendor-services.component.css']
})
export class VendorServicesComponent implements OnInit {
  
  vendorServices: VendorServiceModel[];

  userName: string;

  vendorServiceForm = new FormGroup({
    serviceType: new FormControl('', [ Validators.required ]),
    serviceName: new FormControl('', [ Validators.required ]),
    serviceDescription: new FormControl('', [ Validators.required ]),
    price: new FormControl('', [ Validators.required ]),
  });

  constructor(
    private auth: AuthService,
    private vendorServicesService: VendorServicesService,
    private vendorService: VendorService,
    private router: Router,
    private snackbar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    var vendor;
    if (this.auth.user) {
      this.userName = this.auth.user.userName;
      this.vendorService.getVendor(this.userName).subscribe(response => {
        var vendor = response;
      });
      this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
        this.vendorServices = response;
      });
    } else {
      this.auth.user$.subscribe((result) => {
        this.userName = result.userName;
        this.vendorService.getVendor(this.userName).subscribe(response => {
          var vendor = response;
        });
        this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
          this.vendorServices = response;
        });
      });

  }
}
}
