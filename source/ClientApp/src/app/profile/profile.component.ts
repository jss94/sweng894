import { Component, OnInit } from '@angular/core';
import { ProfileService } from './Services/profile.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    confirm: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    name: new FormControl(''),
    street: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    zip: new FormControl('', [ Validators.min(10), Validators.max(99999) ]),
    role: new FormControl('', Validators.required),

    companyName: new FormControl('', [ Validators.required ]),
    companyType: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    companyWebsite: new FormControl('', [ Validators.minLength(8) ]),
    companyPhone: new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]),
    companyStreet: new FormControl(''),
    companyCity: new FormControl(''),
    companyState: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2) ]),
    companyZip: new FormControl('', [ Validators.min(10), Validators.max(99999) ])
  });

  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private snackbar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.profile.get(user.userName).subscribe(result => {
        console.log(result)
      });
    });

  }


}
