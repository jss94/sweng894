import { Component, OnInit, Inject } from '@angular/core';
import { Guest } from './Models/guest.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component(
    {
        selector: 'app-update-guests',
        templateUrl: './update-guests.component.html',
        styleUrls: [ './update-guests.component.css']
    }
)


export class UpdateGuestsComponent implements OnInit {
    private guest: Guest;
    public selectedValue: string;
    public options: DropDownOption[] = [
        {value: 'undecided', viewValue: 'UNDECIDED'},
        {value: 'yes', viewValue: 'YES'},
        {value: 'no', viewValue: 'NO'},
    ];

    updateGuestForm = new FormGroup({
        name: new FormControl('', [ Validators.required ]),
        email: new FormControl('', [ Validators.required, Validators.email] ),
      });

    constructor(
        public dialogRef: MatDialogRef<UpdateGuestsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UpdateGuestData,
        ) {

    }

    ngOnInit() {
        this.guest = this.data.guest;
        this.updateGuestForm.controls['name'].setValue(this.guest.name);
        this.updateGuestForm.controls['email'].setValue(this.guest.email);
        this.setSelected(this.guest.isGoing);
    }

    onClick(affirm: boolean) {
        this.guest.name = this.updateGuestForm.controls['name'].value;
        this.guest.email = this.updateGuestForm.controls['email'].value;
        this.setIsGoing(this.selectedValue);

        this.dialogRef.close({
            data: {
                save: affirm,
                guest: this.guest,
            }
        });
    }

    setIsGoing(value: string) {
        if (value === 'yes') {
            this.guest.isGoing = true;
        } else if (value === 'no') {
            this.guest.isGoing = false;
        } else {
            this.guest.isGoing = null;
        }
    }

    setSelected(value: boolean) {
        if (value === true) {
            this.selectedValue = 'yes';
        } else if (value === false) {
            this.selectedValue = 'no';
        } else {
            this.selectedValue = 'undecided';
        }
    }
}

export interface DropDownOption {
    value: string;
    viewValue: string;
}

export interface UpdateGuestData {
    guest: Guest;
  }
