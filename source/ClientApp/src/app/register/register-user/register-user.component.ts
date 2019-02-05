import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionPanel } from '@angular/material';
import { User } from '../../shared/models/user.model';
import { RegisterService } from '../Services/register.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: [ './register-user.component.css']
})
export class RegisterUserComponent {

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
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    confirm: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    name: new FormControl(''),
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    zip: new FormControl('', [ Validators.min(10), Validators.max(99999) ]),
    role: new FormControl('', Validators.required)
  });

  constructor(
    private service: RegisterService,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    ) { }

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

    const password = this.userForm.controls['password'].value;
    const confirm = this.userForm.controls['confirm'].value;
    let message = 'Successfully Registered User';

    if (password === confirm) {
      this.service.registerUser(user, password).subscribe((result) => {
        if (result[1].email_verified = false) {
          message = 'Email already exists.';
        }

        this.snackbar.open(message, '', {
          duration: 2000
        });

        // reload page
        this.expansion.close();
        this.userForm.reset();
        this.auth.login();

      }, (error) => {
        message = error.error.description;

        this.snackbar.open(message, '', {
          duration: 5000
        });
      });
    } else {
      message = 'Passwords do not match.';

      this.snackbar.open(message, '', {
        duration: 5000
      });
    }
  }
}
