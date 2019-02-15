import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestsService } from './Services/guests.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

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

    updateGuestForm = new FormGroup({
        name: new FormControl('', [ Validators.required ]),
        email: new FormControl('', [ Validators.required, Validators.email] ),
        isGoing: new FormControl('', [ Validators.required ] ),
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
                console.log(result);
                
                this.updateGuestForm.controls['name'].setValue(this.guest.name);
                this.updateGuestForm.controls['email'].setValue(this.guest.email);
                this.updateGuestForm.controls['isGoing'].setValue(this.guest.isGoing);
            });
        });
    }

    onSave() {
        this.guest.name = this.updateGuestForm.controls['name'].value;
        this.guest.email = this.updateGuestForm.controls['email'].value;
        this.guest.isGoing = Boolean(this.updateGuestForm.controls['isGoing'].value);
        this.guestService.update(this.guest);
        this.router.navigate(['/guests/' + this.guest.eventId]);
    }

    onCancel() {
        this.router.navigate(['/guests/' + this.guest.eventId]);
    }
}