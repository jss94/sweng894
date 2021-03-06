import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestsService } from './Services/guests.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EventService } from '../events/Services/event.service';
import { OccEvent } from '../events/Models/occ-event.model';
import { UpdateGuestsComponent } from './update-guests.component';

@Component(
    {
        selector: 'app-guests',
        templateUrl: './guests.component.html',
        styleUrls: [ './guests.component.css']
    }
)
export class GuestsComponent implements OnInit {
    public guests: Guest[];
    private eventGuid: string;
    isVendor = false;
    eventName: string;

  constructor(
        public auth: AuthService,
        private guestService: GuestsService,
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        private eventService: EventService,
        private dialog: MatDialog,
        ) {

    }

    guestForm = new FormGroup({
        name: new FormControl('', [ Validators.required ]),
        email: new FormControl('', [ Validators.required, Validators.email] ),
      });

  ngOnInit() {
    const userRole = this.auth.user$.subscribe(usr => {
      if (usr.role === 'VENDOR') {
        this.isVendor = true;
      }
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.eventGuid = params.get('eventGuid');

      this.guestService.getGuests(this.eventGuid).subscribe((result: Guest[]) => {
        if (result) {
          this.guests = result.map((guest: Guest) => {
            guest.isUndecided = guest.isGoing === null;
            return guest;
          });
        }
      });


    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.eventGuid = params.get('eventGuid');

      this.eventService.getEvent(this.eventGuid).subscribe((result: OccEvent) => {
        if (result) {
          this.eventName = result.name;
        }
      });

    });


    this.route.paramMap.subscribe((params: ParamMap) => {
      this.eventGuid = params.get('eventGuid');

      this.eventService.getEvent(this.eventGuid).subscribe((result: OccEvent) => {
        this.eventName = result.name;
      });

    });
  }

  returnToEventDetails(): void {
    this.router.navigate(['/events/' + this.eventGuid]);
  }

    onCreate(): void {
        const guest: Guest = {
          name:  this.guestForm.controls['name'].value,
          email:  this.guestForm.controls['email'].value,
          isGoing: null,
          eventGuid: this.eventGuid
         };

        this.guestService.insert(guest).subscribe(response => {
          this.ngOnInit();
          this.guestForm.reset();
          this.snackbar.open('Successfully Created ' + guest.name, '', {
            duration: 1500
          });
        });
    }

    delete(guest: Guest) {
        this.guestService.delete(guest.guestId + '').subscribe(response => {
            // reload page
            this.ngOnInit();
            this.snackbar.open('Successfully Deleted ' + guest.name, '', {
                duration: 3000
            });
        });
    }

    editClicked(guest: Guest) {
      const dialogRef = this.dialog.open(UpdateGuestsComponent, {
        width: '400px',
        data: {
            guest: guest
        }
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          if (result.data.save) {
            this.guestService.update(result.data.guest).subscribe(() => {
              // this.router.navigate(['/guests/' + this.guest.eventGuid]);
              this.ngOnInit();
            });
          }
      });
      // this.router.navigate(['/update-guests/' + guest.guestId]);
    }

}
