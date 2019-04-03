import { Component, OnInit } from '@angular/core';
import { Reservation } from '../Models/reservation.model';
import { ReservationsService } from '../Services/reservations.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { User } from 'src/app/shared/models/user.model';

@Component(
    {
        selector: 'app-reservations-vendor',
        templateUrl: './reservations-vendor.component.html',
        styleUrls: [ './reservations-vendor.component.css']
    }
)
export class ReservationsVendorComponent implements OnInit {
    reservations: Reservation[];
    newReservations: Reservation[];
    changedReservations: Reservation[];
    approvedReservations: Reservation[];
    newCount: number;
    changedCount: number;
    approvedCount: number;
    occasionVendor: Vendor;

    constructor(
        private authService: AuthService,
        private reservationService: ReservationsService,
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        private vendorService: VendorService,
        ) {

    }

    ngOnInit() {
        if (this.authService.user) {
            this.setOccasionsVendor(this.authService.user);
        } else {
            this.authService.user$.subscribe(result => {
                this.setOccasionsVendor(result);
            });
        }
    }

    setOccasionsVendor(user: User) {
        this.vendorService.getVendor(user.userName).subscribe(v => {
          this.occasionVendor = v;
          console.log(this.occasionVendor);
          this.createReservationLists();
        });
    }

    createReservationLists() {
        this.reservationService.getReservationByVendorId(this.occasionVendor.id).subscribe((result) => {
            this.reservations = result;
            if (this.reservations != null) {
                for (const reservation of this.reservations) {
                    if (reservation.status === 'New') {
                        this.newReservations.push(reservation);
                    } else if (reservation.status === 'Changed') {
                        this.changedReservations.push(reservation);
                    } else {
                        this.approvedReservations.push(reservation);
                    }
                }
            }
            this.setReservationCounts();
        });
    }

    setReservationCounts() {
        this.newCount = this.newReservations != null ? this.newReservations.length : 0;
        this.changedCount = this.changedReservations != null ? this.changedReservations.length : 0;
        this.approvedCount = this.approvedReservations != null ? this.approvedReservations.length : 0;
    }

    onAcceptClicked(reservation: Reservation) {
        reservation.status = 'Accepted';
        this.reservationService.updateReservation(reservation).subscribe( response => {
            this.snackbar.open('Successfully Approved '
            + reservation.vendorService.serviceName
            + ' For ' + reservation.event.userName, '', {
                duration: 3000
            });
            this.ngOnInit();
        });
    }

    onDeclinedClicked(reservation: Reservation) {
        this.reservationService.deleteReservation(reservation).subscribe( response => {
            this.snackbar.open('Successfully Declined '
            + reservation.vendorService.serviceName
            + ' For ' + reservation.event.userName, '', {
                duration: 3000
            });
            this.ngOnInit();
        });
    }
}