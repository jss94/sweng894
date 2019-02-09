import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../shared/components/warning-dialog/warning-dialog.component';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../get-users/Services/get-users.service';

@Component({
    selector: 'app-deactivate-user',
    template: ''
  })
  export class DeactivateUserComponent {
      constructor(
        private dialog: MatDialog,
        private userService: UsersService,
        private authService: AuthService,
      ) {
        const dialogRef = dialog.open(WarningDialogComponent, {
            width: '300px',
            data: {
                title: 'Warning',
                content: 'Are you sure you want to deactivate your account?',
                buttonText1: 'No',
                buttonText2: 'Yes'
            }
          });

          dialogRef.afterClosed()
          .subscribe(result => {
            if (result === true) {
              this.userService.deactivateUser(this.authService.user).subscribe(() => {
                this.authService.logout();
              });
            }
          });
      }
  }
