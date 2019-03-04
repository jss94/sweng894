import { Component, OnInit } from '@angular/core';
import { Reservation } from '../Models/reservation.model';
import { ReservationsService } from '../Services/reservations.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component(
    {
        selector: 'app-reservations-vendor',
        templateUrl: './reservations-vendor.component.html',
        styleUrls: [ './reservations-vendor.component.css']
    }
)
export class ReservationsVendorComponent implements OnInit {
    public reservations: Reservation[];
    public newCount: number;
    public newReservations: string[];
    public services: string[];

    constructor(
        private auth: AuthService,
        private reservationService: ReservationsService,
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        ) {

    }

    ngOnInit() {
        this.newReservations = [
            "Reservation 1",
            "Reservation 2",
            "Reservation 3",
            "Reservation 4",
            "Reservation 5",
            "Reservation 6",
        ];
        this.newCount = this.newReservations.length;
        this.services = [
            "Service 1",
            "Service 2",
            "Service 3",
            "Service 4",
        ];
    }
}