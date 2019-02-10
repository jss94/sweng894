import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestsService } from './Services/guests.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component(
    {
        selector: 'app-guests',
        templateUrl: './guests.component.html',
        styleUrls: [ './guests.component.css']
    }
)
export class GuestsComponent implements OnInit {
    public guests: Guest[];
    private eventId: string;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private auth: AuthService,
        private guestService: GuestsService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        ) {

    }

    guestForm = new FormGroup({
        name: new FormControl('', [ Validators.required ]),
        email: new FormControl('', [ Validators.required, Validators.email] ),
      });

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.eventId = params.get('eventId');
            this.guestService.getGuests(this.eventId).subscribe((result: Guest[]) => {
                this.guests = result.map((guest: Guest) => {
                    guest.isUndecided = guest.isGoing === null;
                    return guest;
                });
                console.log(result)
            });
        });


    }

    onCreate(): void {
        const guest: Guest = {
          name:  this.guestForm.controls['name'].value,
          email:  this.guestForm.controls['email'].value,
          isGoing: null,
          eventId: Number(this.eventId)
         };
    
        this.guestService.insert(guest).subscribe(response => {
          this.ngOnInit();
          this.guestForm.reset();
          this.snackbar.open('Successfully Created ' + guest.name, '', {
            duration: 1500
          });
        });
    
      }

    addGuestClicked() {
        
    }

    delete(guest: Guest) {
        this.guestService.delete(guest.guestId+"").subscribe(response => {
            // reload page
            this.ngOnInit();
            this.snackbar.open('Successfully Deleted ' + guest.name, '', {
                duration: 3000
            });
        });
    }

}
