import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './Services/user-profile.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../shared/models/user.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';
import { P } from '@angular/core/src/render3';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [ './user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  vendor: Vendor;

  profileForm = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    companyName: new FormControl('', [ Validators.required ]),
    companyWebsite: new FormControl('', [ Validators.minLength(8) ]),
    companyPhone: new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]),
    companyStreet: new FormControl(''),
    companyCity: new FormControl(''),
    companyState: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    companyZip: new FormControl('', [ Validators.min(10), Validators.max(99999) ])
  });

  constructor(
    private auth: AuthService,
    private profile: UserProfileService,
    private snackbar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.setUserProfile(this.auth.user);
    } else {
      this.auth.user$.subscribe(user => {
        this.setUserProfile(user);
      });
    }
  }

  setUserProfile(user: User) {
    this.profile.get(user.userName).subscribe(([u, v]) => {
      this.user = u;
      this.vendor = v;

      if (this.vendor.address.zip === 0) {
        this.vendor.address.zip = undefined;
      }

      this.profileForm.controls['name'].setValue(this.user.name);
      this.profileForm.controls['companyName'].setValue(this.vendor.name);
      this.profileForm.controls['companyWebsite'].setValue(this.vendor.website);
      this.profileForm.controls['companyPhone'].setValue(this.vendor.phone);
      this.profileForm.controls['companyStreet'].setValue(this.vendor.address.street);
      this.profileForm.controls['companyCity'].setValue(this.vendor.address.city);
      this.profileForm.controls['companyState'].setValue(this.vendor.address.state);
      this.profileForm.controls['companyZip'].setValue(this.vendor.address.zip);
    });
  }

  onUpdateUser() {
    this.user = {
      id: this.user.id,
      userName: this.user.userName,
      name: this.profileForm.controls['name'].value,
      role: this.user.role,
    };

    const address: Address = {
      street: this.profileForm.controls['companyStreet'].value,
      city: this.profileForm.controls['companyCity'].value,
      state: this.profileForm.controls['companyState'].value,
      zip: this.profileForm.controls['companyZip'].value,
    };

    this.vendor = {
      userName: this.vendor.userName,
      name: this.profileForm.controls['companyName'].value,
      website: this.profileForm.controls['companyWebsite'].value,
      phone: this.profileForm.controls['companyPhone'].value,
      address: address,
    };

    this.profile.update(this.user, this.vendor).subscribe(result => {
      const message = 'User was successfully updated';
      this.snackbar.open(message, 'Updated', {
        duration: 2000,
      });
    }, (error) => {
      console.log(error);
      const message = 'Problem updating the user information.';
      this.snackbar.open(message, 'Failed', {
        duration: 5000,
      });
    });
  }


}
