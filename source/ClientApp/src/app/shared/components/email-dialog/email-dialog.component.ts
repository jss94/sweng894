import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EmailDialogData {
  iconName: string;
    title: string;
    content: string;
    buttonText1: string;
    buttonText2: string;
}

@Component({
    selector: 'app-email-dialog',
    templateUrl: './email-dialog.component.html',
    styleUrls: [ './email-dialog.component.css']
  })
export class EmailDialogComponent {
      constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: EmailDialogData
      ) {}

      onClickAffirm(): void {
          this.dialogRef.close(true);
      }

  }
