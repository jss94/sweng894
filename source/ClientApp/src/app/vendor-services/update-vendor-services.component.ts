import { Component, OnInit } from '@angular/core';
import { VendorServices } from '../shared/models/vendor-services.model';
import { VendorServicesService } from './Services/vendor-services.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { stringify } from 'querystring';


@Component({
  selector: 'app-update-vendor-services',
  templateUrl: './update-vendor-services.component.html',
  styleUrls: ['./update-vendor-services.component.css']
})
export class UpdateVendorServicesComponent implements OnInit {

  vendorServiceId = 0;
  vendorService: VendorServices;
  selected: any;

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

  updateVendorServiceForm = new FormGroup({
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
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.updateVendorServiceForm.controls['serviceFlatFee'].valueChanges.subscribe(
      (value) => {
        if (value) {
          this.updateVendorServiceForm.controls['serviceUnitsAvailable'].disable();
          this.updateVendorServiceForm.controls['serviceUnitsAvailable'].setValue('');
       } else {
        this.updateVendorServiceForm.controls['serviceUnitsAvailable'].enable();
       }
      }
    );
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.vendorServiceId = parseInt(params.get('id'), 10);
      this.vendorServicesService.getVendorServiceById(this.vendorServiceId).subscribe((result: VendorServices) => {
          this.vendorService = result;
          this.updateVendorServiceForm.controls['serviceType'].setValue(this.vendorService.serviceType);
          this.updateVendorServiceForm.controls['serviceName'].setValue(this.vendorService.serviceName);
          this.updateVendorServiceForm.controls['serviceDescription'].setValue(this.vendorService.serviceDescription);
          this.updateVendorServiceForm.controls['serviceFlatFee'].setValue(this.vendorService.flatFee);
          this.updateVendorServiceForm.controls['servicePrice'].setValue(this.vendorService.price);
          this.updateVendorServiceForm.controls['serviceUnitsAvailable'].setValue(this.vendorService.unitsAvailable);
      });
  });
  }

  onCreate() {
    const svc: VendorServices = {
      id: this.vendorServiceId,
      vendorId: this.vendorService.vendorId,
      serviceType: this.updateVendorServiceForm.controls['serviceType'].value,
      serviceName:  this.updateVendorServiceForm.controls['serviceName'].value,
      serviceDescription:  this.updateVendorServiceForm.controls['serviceDescription'].value,
      flatFee: this.updateVendorServiceForm.controls['serviceFlatFee'].value,
      price: this.updateVendorServiceForm.controls['servicePrice'].value,
      unitsAvailable: this.updateVendorServiceForm.controls['serviceUnitsAvailable'].value,
     };
     this.vendorServicesService.updateVendorService(svc).subscribe((result: VendorServices) => {
      this.vendorService = result;
      this.updateVendorServiceForm.controls['serviceType'].setValue(this.vendorService.serviceType);
      this.updateVendorServiceForm.controls['serviceName'].setValue(this.vendorService.serviceName);
      this.updateVendorServiceForm.controls['serviceDescription'].setValue(this.vendorService.serviceDescription);
      this.updateVendorServiceForm.controls['serviceFlatFee'].setValue(this.vendorService.flatFee);
      this.updateVendorServiceForm.controls['servicePrice'].setValue(this.vendorService.price);
      this.updateVendorServiceForm.controls['serviceUnitsAvailable'].setValue(this.vendorService.unitsAvailable);
  });
  this.vendorServicesService.updateVendorService(svc).subscribe(response => {
    this.ngOnInit();
    this.snackbar.open('Successfully Updated ' + svc.serviceName, '', {
      duration: 1500
    });
  });
}

onCancel() {
  this.router.navigate(['/vendor-services/']);
}

}



