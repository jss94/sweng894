import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from '../Services/register.service';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrls: [ './register-vendor.component.css']
})
export class RegisterVendorComponent {

  isUserRegistrationActive = false;

  vendorForm = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    website: new FormControl('', [ Validators.minLength(8) ]),
    phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]),
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    zip: new FormControl('', [ Validators.min(10), Validators.max(99999) ])
  });

  constructor(
    private service: RegisterService,
    private snackbar: MatSnackBar,
    private router: Router,
    private auth: AuthService,
    ) { }

  onAddVendor() {
    const vendor: Vendor = {
      userName: this.auth.user.userName,
      name: this.vendorForm.controls['name'].value,
      website: this.vendorForm.controls['website'].value,
      phone: this.vendorForm.controls['phone'].value,
      address: {
        userName: this.auth.user.userName,
        street: this.vendorForm.controls['street'].value,
        city: this.vendorForm.controls['city'].value,
        state: this.vendorForm.controls['state'].value.toUpperCase(),
        zip: this.vendorForm.controls['zip'].value,
      }
    };

    let message = 'Successfully Registered Vendor';

    this.service.registerVendor(vendor).subscribe((result) => {

      this.snackbar.open(message, '', {
        duration: 2000
      });

      // reload page
      this.vendorForm.reset();
      this.router.navigate(['/events']);

    }, (error) => {
      message = error.error.description;

      this.snackbar.open(message, '', {
        duration: 5000
      });
    });

  }
}
