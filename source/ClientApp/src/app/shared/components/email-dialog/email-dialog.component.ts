import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EmailDialogData {
  iconName: string;
  title: string;
  subject: string;
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

  @ViewChild('contentInput') contentInput: ElementRef;
  @ViewChild('subjectInput') subjectInput: ElementRef;

      constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: EmailDialogData
      ) {}

      onClick(affirm: boolean): void {
        this.dialogRef.close({
          data: {
            subject: this.subjectInput.nativeElement.value,
            content: this.contentInput.nativeElement.value,
            button: affirm
          } });
      }

  }
