import { Component } from '@angular/core';
import { User } from './Models/user.model';
import { GetUsersService } from './Services/get-users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Address } from '../shared/models/address.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: [ './get-users.component.css']
})
export class GetUsersComponent {
  users: User[];

  roles = [
    {
      value: 'Organizer',
      viewValue: 'Event Organizer'
    },
    {
      value: 'Vendor',
      viewValue: 'Vendor'
    }
  ];

  userForm = new FormGroup({
    email: new FormControl('', Validators.required),
    name: new FormControl(''),
    address: new FormControl(''),
    locality: new FormControl(''),
    region: new FormControl('', Validators.maxLength(2)),
    postalcode: new FormControl(''),
    role: new FormControl('', Validators.required)
  });

  constructor(private service: GetUsersService) {
    this.service.getUsers().subscribe(response => {
      this.users = response;
    });
  }

  onAddUser() {
    const user: User = {
      userName: this.userForm.controls['email'].value,
      name: this.userForm.controls['name'].value,
      role: this.userForm.controls['role'].value.toUpperCase(),
    };

    const address: Address = {
      street: this.userForm.controls['street'].value,
      city: this.userForm.controls['locality'].value,
      state: this.userForm.controls['region'].value.toUpperCase(),
      zip: this.userForm.controls['postalcode'].value,
    };

    this.service.registerUser(user, address);

  }
}
