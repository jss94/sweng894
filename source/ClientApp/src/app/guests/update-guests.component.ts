import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestsService } from './Services/guests.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { stringify } from 'querystring';

@Component(
    {
        selector: 'app-update-guests',
        templateUrl: './update-guests.component.html',
        styleUrls: [ './update-guests.component.css']
    }
)


export class UpdateGuestsComponent implements OnInit {
    private guest: Guest;
    private guestId: string;
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
        private auth: AuthService,
        private guestService: GuestsService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        private router: Router,
        ) {

    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.guestId = params.get('guestId');
            this.guestService.getGuest(this.guestId).subscribe((result: Guest) => {
                this.guest = result;
                this.updateGuestForm.controls['name'].setValue(this.guest.name);
                this.updateGuestForm.controls['email'].setValue(this.guest.email);
                this.setSelected(this.guest.isGoing);
            });
        });
    }

    onSave() {
        this.guest.name = this.updateGuestForm.controls['name'].value;
        this.guest.email = this.updateGuestForm.controls['email'].value;
        this.setIsGoing(this.selectedValue);
        this.guestService.update(this.guest).subscribe(() => {
          this.router.navigate(['/guests/' + this.guest.eventGuid]);
        });

    }

    onCancel() {
        this.router.navigate(['/guests/' + this.guest.eventId]);
    }

    setIsGoing(value: string) {
        if(value === 'yes')
        {
            this.guest.isGoing = true;
        }
        else if(value === 'no')
        {
            this.guest.isGoing = false;
        }
        else
        {
            this.guest.isGoing = null;
        }
    }

    setSelected(value: boolean) {
        if(value === true)
        {
            this.selectedValue = 'yes'
        }
        else if(value === false)
        {
            this.selectedValue = 'no'
        }
        else
        {
            this.selectedValue = 'undecided'
        }
    }
}

export interface DropDownOption {
    value: string;
    viewValue: string;
}
