import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeactivateUserComponent } from 'src/app/deactivate-user/deactivate-user.component';

export interface WarningDialogData {
    title: string;
    content: string;
    buttonText1: string;
    buttonText2: string;
}

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html'
  })
  export class WarningDialogComponent {
      constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: WarningDialogData
      ) { }

      onClickAffirm(): void {
          this.dialogRef.close(true);
      }

  }
