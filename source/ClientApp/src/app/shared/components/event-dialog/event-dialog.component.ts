import { Component, Inject, OnInit } from '@angular/core';
import { OccEvent } from '../../../events/Models/occ-event.model';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData
  ) {}

  editEventForm = new FormGroup({
    date: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
  });

  ngOnInit() {
    this.editEventForm.controls['name'].setValue(this.data.event.name);
    this.editEventForm.controls['description'].setValue(this.data.event.description);
    this.editEventForm.controls['date'].setValue(new Date(this.data.event.dateTime));
    // console.log('%s', this.data.event.dateTime);
  }

  onClick(affirm: boolean): void {
    this.dialogRef.close({
      data: {
        newName: this.editEventForm.controls['name'].value,
        newDate: this.editEventForm.controls['date'].value.toISOString().slice(0, 19).replace('T', ' '),
        newDescription: this.editEventForm.controls['description'].value,
        save: affirm,
        event: this.data.event
      }
    });
  }

}

export interface EventDialogData {
  iconName: string;
  title: string;
  buttonText: string;
  event: OccEvent;
}
