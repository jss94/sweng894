import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../shared/models/user.model';
import { UsersService } from './Services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionPanel } from '@angular/material';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-get-users',
  templateUrl: './users.component.html',
  styleUrls: [ './users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatExpansionPanel) expansion: MatExpansionPanel;

  users: User[];
  isUserRegistrationActive = false;
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
    private service: UsersService,
    private snackbar: MatSnackBar,
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
    };

    this.service.registerUser(user).subscribe((result) => {
      let message = 'Successfully Registered User';

      if (result.id === null) {
        message = 'Error Registering User';
      }

      this.snackbar.open(message, '', {
        duration: 2000
      });
    });

    // reload page
    this.expansion.close();
    this.userForm.reset();
    this.ngOnInit();
  }


  // TODO : This will only work if we also delete the user from Auth0;
  // To delete the user from Auth0 we neeed their user_id string from Auth0 DB.
  // onDeleteUser(user: User) {
  //   this.service.deleteUser(user).subscribe(() => {
  //     this.snackbar.open(user.userName + ' was deleted.', '', {
  //       duration: 1500
  //     });

  //     this.ngOnInit();
  //   }, (error) => {
  //     this.snackbar.open('There was an issue deleting ' + user.userName, '', {
  //       duration: 5000
  //     });

  //     this.ngOnInit();
  //   });
  // }
}
