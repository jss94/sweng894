import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionPanel } from '@angular/material';
import { User } from '../../shared/models/user.model';
import { RegisterService } from '../Services/register.service';
import { AuthService } from '../../shared/services/auth.service';
import { Vendor } from 'src/app/vendors/Models/vendor.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: [ './register-user.component.css']
})
export class RegisterVendorComponent {

  @ViewChild(MatExpansionPanel) expansion: MatExpansionPanel;

  isUserRegistrationActive = false;

  userForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    name: new FormControl('', [ Validators.required ]),
    type: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    website: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]),
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    zip: new FormControl('', [ Validators.min(10), Validators.max(99999) ])
  });

  constructor(
    private service: RegisterService,
    private snackbar: MatSnackBar,
    ) { }

  onAddVendor() {
    const vendor: Vendor = {
      userName: this.userForm.controls['email'].value,
      name: this.userForm.controls['name'].value,
      type: this.userForm.controls['type'].value,
      website: this.userForm.controls['website'].value,
      phone: this.userForm.controls['phone'].value,
      address: {
        street: this.userForm.controls['street'].value,
        city: this.userForm.controls['city'].value,
        state: this.userForm.controls['state'].value.toUpperCase(),
        zip: this.userForm.controls['zip'].value,
      }
    };

    const password = this.userForm.controls['password'].value;
    const confirm = this.userForm.controls['confirm'].value;
    let message = 'Successfully Registered Vendor';

    this.service.registerVendor(vendor).subscribe((result) => {

      this.snackbar.open(message, '', {
        duration: 2000
      });

      // reload page
      this.expansion.close();
      this.userForm.reset();

    }, (error) => {
      message = error.error.description;

      this.snackbar.open(message, '', {
        duration: 5000
      });
    });

  }
}
