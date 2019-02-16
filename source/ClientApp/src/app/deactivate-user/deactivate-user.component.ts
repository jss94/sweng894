import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../shared/components/warning-dialog/warning-dialog.component';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../users/Services/users.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'app-deactivate-user',
    template: ''
  })
  export class DeactivateUserComponent implements OnInit {
      constructor(
        private router: Router,
        private dialog: MatDialog,
        private userService: UsersService,
        private authService: AuthService,
        private snackbar: MatSnackBar,
      ) {
      }

      ngOnInit() {
        const dialogRef = this.dialog.open(WarningDialogComponent, {
          width: '400px',
          data: {
              title: 'Warning',
              content: 'Are you sure you want to deactivate your account? This will delete all your events.',
              buttonText1: 'No',
              buttonText2: 'Yes'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.userService.deactivateUser(this.authService.user).subscribe(() => {
              this.authService.logout();

              const message = 'Your account and all connected events have been disabled.';
              this.snackbar.open(message, 'close', {
                duration: 5000,
              });

            });
          } else {
            this.router.navigate(['/user-profile']);
          }
        });
      }
  }
