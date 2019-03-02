import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../events/Services/event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-guest-entry',
  templateUrl: './guest-entry.component.html',
  styleUrls: [ './guest-entry.component.css' ]
})
export class GuestEntryComponent implements OnInit {

  eventForm = new FormGroup({
    guid: new FormControl('', [ Validators.required ]),
  });

  constructor(
    private eventService: EventService,
    private router: Router,
    private snackbar: MatSnackBar,
    ) {
  }

  ngOnInit() {
  }

  goToEventClicked() {
    this.eventService.getEvent(this.eventForm.controls['guid'].value)
    .subscribe(result => {
      this.router.navigate(['/events/' + result.guid]);
    }, error => {
      if (error.status === 404) {
        const message = 'Unable to find your event.';
        this.snackbar.open(message, 'Unknown Event', {
          duration: 10000
        });
      }
    });
  }
}
