import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestService } from './Services/guest.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component
(
    {
        selector: 'app-guest',
        templateUrl: './guest.component.html',
        styleUrls: [ './guest.component.css']
    }
)
export class GuestComponent implements OnInit {
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
        private guestService: GuestService,
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
