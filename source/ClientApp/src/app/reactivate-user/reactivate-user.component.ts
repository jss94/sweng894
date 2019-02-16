import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../shared/components/warning-dialog/warning-dialog.component';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../users/Services/users.service';

@Component({
    selector: 'app-deactivate-user',
    template: ''
  })
  export class ReactivateUserComponent implements OnInit {
      constructor(
        private dialog: MatDialog,
        private userService: UsersService,
        private authService: AuthService,
      ) {
      }

      ngOnInit() {
        const dialogRef = this.dialog.open(WarningDialogComponent, {
          width: '300px',
          data: {
              title: 'Reactivation',
              content: 'You account was disabled would you like to reactivate your account?',
              buttonText1: 'No',
              buttonText2: 'Yes'
          }
        });

        dialogRef.afterClosed()
        .subscribe(result => {
          if (result === true) {
            this.userService.reactivateUser(this.authService.profile.name).subscribe(() => {
              this.authService.login();
            });
          }
        });
      }
  }
