/// <reference types="@types/googlemaps" />

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { GooglePlacesService } from '../Services/google-places.service';
import { GoogleMapsService } from 'src/app/google-map/Services/google-maps.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';
import { VendorSearchService } from '../Services/vendor-search.service';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { User } from 'src/app/shared/models/user.model';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { MatSnackBar } from '@angular/material';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { VendorDetailsComponent } from 'src/app/vendor-details/vendor-details.component';

@Component({
  selector: 'app-claim-vendor',
  templateUrl: './claim-vendor.component.html',
  styleUrls: [ './claim-vendor.component.css']
})
export class ClaimVendorComponent implements OnInit {
  map: google.maps.Map;
  geolocation$ = new Subject();
  googleVendorId: string;
  googleVendor: any;
  occasionVendor: Vendor;
  vendorType: string;
  isVendor: boolean;

  vendorServiceForm = new FormGroup({
    serviceType: new FormControl('', [ Validators.required ]),
    serviceName: new FormControl('', [ Validators.required ]),
    serviceDescription: new FormControl('', [ Validators.required ]),
    serviceFlatFee: new FormControl('', [ Validators.required ]),
    servicePrice: new FormControl('', [ Validators.required ]),
    serviceUnitsAvailable: new FormControl('', [ Validators.required ]),
  });

  svcs = [
    {
      value: 'Venue',
      viewValue: 'Venue'
    },
    {
      value: 'Catering',
      viewValue: 'Catering'
    },
    {
      value: 'Flowers',
      viewValue: 'Flowers'
    },
    {
      value: 'Supplies',
      viewValue: 'Supplies'
    },
    {
      value: 'Lodging',
      viewValue: 'Lodging'
    },
    {
      value: 'Activities',
      viewValue: 'Activities'
    },
    {
      value: 'Other',
      viewValue: 'Other'
    },
  ];

  fees = [
    {
      value: true,
      viewValue: 'This is a flat fee'
    },
    {
      value: false,
      viewValue: 'This is not a flat fee'
    },
  ];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private vendorSearchService: VendorSearchService,
    private googlePlacesService: GooglePlacesService,
    private googleMapsService: GoogleMapsService,
    private snackbar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    this.googleVendorId = this.route.snapshot.paramMap.get('id');
    this.vendorType = this.route.snapshot.paramMap.get('type');

    if (this.authService.user) {
      this.isVendor = this.authService.user.role === 'VENDOR' || this.authService.user.role === 'Admin';
      this.setOccasionsVendor(this.authService.user);
    } else {
      this.authService.user$.subscribe(user => {
        this.isVendor = user.role === 'VENDOR' || user.role === 'Admin';
        this.setOccasionsVendor(user);
      });
    }

    this.setUiElement();

    this.setMap();

    this.setGoogleVendor();
  }

  setOccasionsVendor(user: User) {
    this.vendorService.getVendor(user.userName).subscribe(vendor => {
      this.occasionVendor = vendor;
    });
  }

  setGoogleVendor() {
    this.googlePlacesService.getVendorById(this.googleVendorId, this.map)
    .subscribe(vendor => {
      this.googleVendor = vendor;

      this.setForm(vendor.name, this.vendorType);
    });
  }

  setMap() {
    const property = {
      zoom: 12,
      center: {lat: 0, lng: 0}
    };

    this.map = this.googleMapsService.setMap(document.getElementById('vendor-map'), property);
  }

  setUiElement() {
    this.vendorServiceForm.controls['serviceFlatFee'].valueChanges.subscribe(
      (value) => {
        if (value) {
          this.vendorServiceForm.controls['serviceUnitsAvailable'].disable();
          this.vendorServiceForm.controls['serviceUnitsAvailable'].setValue('');
       } else {
        this.vendorServiceForm.controls['serviceUnitsAvailable'].enable();
       }
      }
    );
  }

  setForm(vendorName: string, vendorType: string) {
    this.vendorServiceForm.controls['serviceType'].setValue(vendorType);
    this.vendorServiceForm.controls['serviceName'].setValue(vendorName);
  }

  onSubmitClicked() {
    const username = this.authService.user.userName;
    this.vendorService.getVendor(username).subscribe(vendor => {
      const service: VendorServices = {
        vendorId: vendor.id,
        googleId: this.googleVendorId,
        serviceType: this.vendorServiceForm.controls['serviceType'].value,
        serviceDescription: this.vendorServiceForm.controls['serviceDescription'].value,
        serviceName: this.googleVendor.name,
        flatFee: this.vendorServiceForm.controls['serviceFlatFee'].value,
        price: +this.vendorServiceForm.controls['servicePrice'].value,
        unitsAvailable: +this.vendorServiceForm.controls['serviceUnitsAvailable'].value
      };

      this.vendorSearchService.claimVendorServices(service).subscribe(results => {
          const message = 'You have claimed this service!';
          this.snackbar.open(message, 'Saved', {
            duration: 10000
          });
      }, (error) => {
        console.log('ERROR INSERTING', error);
      });
    });

  }
}
