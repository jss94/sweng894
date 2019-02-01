import { Component, OnInit } from '@angular/core';
import { User } from './Models/user.model';
import { GetUsersService } from './Services/get-users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: [ './get-users.component.css']
})
export class GetUsersComponent implements OnInit {
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
    email: new FormControl('', [ Validators.required, Validators.email ]),
    name: new FormControl(''),
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    zip: new FormControl('', [ Validators.min(10), Validators.max(99999) ]),
    role: new FormControl('', Validators.required)
  });

  constructor(
    private service: GetUsersService,
    ) { }

  ngOnInit() {
    this.service.getUsers().subscribe(response => {
      this.users = response;
    });
  }

  onAddUser() {
    const user: User = {
      userName: this.userForm.controls['email'].value,
      name: this.userForm.controls['name'].value,
      role: this.userForm.controls['role'].value.toUpperCase(),
      address: {
        street: this.userForm.controls['street'].value,
        city: this.userForm.controls['city'].value,
        state: this.userForm.controls['state'].value.toUpperCase(),
        zip: this.userForm.controls['zip'].value,
      }
    };

    this.service.registerUser(user);

    // reload page
    this.ngOnInit();
  }
}
