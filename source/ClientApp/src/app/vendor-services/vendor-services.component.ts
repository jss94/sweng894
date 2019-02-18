import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { VendorServicesService } from './Services/vendor-services.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';

@Component({
  selector: 'app-vendor-services',
  templateUrl: './vendor-services.component.html',
  styleUrls: ['./vendor-services.component.css']
})
export class VendorServicesComponent implements OnInit {

  vendorServices: VendorServices[];
  vendorId = 0;
  userName: string;
  selected;
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

  vendorServiceForm = new FormGroup({
    serviceType: new FormControl('', [ Validators.required ]),
    serviceName: new FormControl('', [ Validators.required ]),
    serviceDescription: new FormControl('', [ Validators.required ]),
    serviceFlatFee: new FormControl('', [ Validators.required ]),
    servicePrice: new FormControl('', [ Validators.required ]),
    serviceUnitsAvailable: new FormControl('', [ Validators.required ]),
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
    if (this.auth.user) {
      this.userName = this.auth.user.userName;
      this.vendorService.getVendor(this.userName).subscribe(vendor => {
        this.vendorId = vendor.id;
        this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
          this.vendorServices = response;
        });
      });

    } else {
      this.auth.user$.subscribe((result) => {
        this.userName = result.userName;
        this.vendorService.getVendor(this.userName).subscribe(vendor => {
          this.vendorId = vendor.id;
          this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
            this.vendorServices = response;
          });
        });

      });

    }
  }

  onCreate(): void {
    const svc: VendorServices = {
      vendorId: this.vendorId,
      serviceType: this.vendorServiceForm.controls['serviceType'].value,
      serviceName:  this.vendorServiceForm.controls['serviceName'].value,
      serviceDescription:  this.vendorServiceForm.controls['serviceDescription'].value,
      flatFee: this.vendorServiceForm.controls['serviceFlatFee'].value,
      price: this.vendorServiceForm.controls['servicePrice'].value,
      unitsAvailable: this.vendorServiceForm.controls['serviceUnitsAvailable'].value,
     };

    this.vendorServicesService.createNewVendorService(svc).subscribe(response => {
      this.ngOnInit();
      this.vendorServiceForm.reset();
      this.snackbar.open('Successfully Created ' + svc.serviceName, 'Created', {
        duration: 1500
      });
    }, error => {
      console.log(error);
      this.snackbar.open('Failed to create ' + svc.serviceName, 'Failed', {
        duration: 3500
      });
    });
  }

  editClicked(service): void {
    this.router.navigate(['/update-vendor-services/' + service.id]);
  }

  onDelete(service): void {
    this.vendorServicesService.deleteVendorService(service).subscribe(response => {
      this.ngOnInit();
      this.vendorServiceForm.reset();
      this.snackbar.open('Successfully Removed ' + service.serviceName, '', {
        duration: 1500
      });
    });
  }



}
