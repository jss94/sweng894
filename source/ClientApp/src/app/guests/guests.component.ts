import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestsService } from './Services/guests.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component(
    {
        selector: 'app-guests',
        templateUrl: './guests.component.html',
        styleUrls: [ './guests.component.css']
    }
)
export class GuestsComponent implements OnInit {
    public guests: Guest[];
    private guest: Guest = {
        guestId: 1,
        firstName: 'Zach',
        lastName: 'Eick',
        email: 'zacharyeick@gmail.com',
        isGoing: true,
        eventId: 1
    };

    constructor(
        private auth: AuthService,
        private guestService: GuestsService,
        private route: ActivatedRoute,
        ) {

    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const eventId = params.get('eventId');

            this.guestService.getGuests(eventId).subscribe(response => {
                this.guests = response;
                this.guests.forEach(element => {
                    console.log(JSON.stringify(element));
                });
            });
        });


    }

}
