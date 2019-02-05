import { Component, OnInit } from '@angular/core';
import { Guest } from './Models/guest.model';
import { GuestService } from './Services/guest.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { element } from '@angular/core/src/render3/instructions';

@Component
(
    {
        selector: 'app-guest',
        templateUrl: './guest.component.html',
        styleUrls: [ './guest.component.css']
    }
)
export class GuestComponent implements OnInit 
{
    public guests: Guest[];
    private guest: Guest = {
        guestId: 1,
        firstName: "Zach",
        lastName: "Eick",
        email: "zacharyeick@gmail.com",
        isGoing: true,
        eventId: 1
    }
    constructor(private auth: AuthService, private GuestService: GuestService) 
    {
        
    }
    ngOnInit() 
    {
        this.GuestService.getGuests("1").subscribe(response => {
            this.guests = response;
            this.guests.forEach(element => {
                console.log(JSON.stringify(element));
            })
        });
    }

}