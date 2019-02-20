import { Component, OnInit } from '@angular/core';
import { GoogleCalendarService } from './Services/google-calendar.service';
import { getAppInitializer } from '@angular/router/src/router_module';

@Component({
    selector: 'app-google-calendar',
    templateUrl: './google-calendar.component.html',
    styleUrls: ['./google-calendar.component.css']
  })

export class GoogleMapComponent implements OnInit {

    constructor(private calendarService: GoogleCalendarService) { }
  
    ngOnInit() {
        
    }
}