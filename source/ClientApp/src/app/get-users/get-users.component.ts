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
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('', Validators.maxLength(2)),
    zip: new FormControl(''),
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
      city: this.userForm.controls['city'].value,
      state: this.userForm.controls['state'].value.toUpperCase(),
      zip: this.userForm.controls['zip'].value,
    };

    user.address = address;

    console.log(user);
    this.service.registerUser(user);

  }
}
