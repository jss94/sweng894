import { Component, OnInit } from '@angular/core';
import { Reservation } from '../Models/reservation.model';
import { ReservationsService } from '../Services/reservations.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';
import { OccEvent } from '../../events/Models/occ-event.model';
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
    public statuses: [ "New", "Changed", "Accepted" ];
    public reservations: Reservation[];
    public newReservations: Reservation[];
    public changedReservations: Reservation[];
    public approvedReservations: Reservation[];
    public newCount: number;
    public changedCount: number;
    public approvedCount: number;
    public vendorId: number;

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
        } 
        else {
            this.authService.user$.subscribe(result => {
                this.setOccasionsVendor(result);
            });
        }

        this.createReservationLists();

        this.setReservationCounts();
    }

    setOccasionsVendor(user: User) {
        this.vendorService.getVendor(user.userName).subscribe(result => {
          this.vendorId = result.id;
        });
    }

    createReservationLists() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.reservationService.getReservationByVendorId(this.vendorId).subscribe((result) => {
                this.reservations = result;
            });
        });

        if (this.reservations != null) {
            for(let reservation of this.reservations) {
                if(reservation.status == this.statuses[0]) {
                    this.newReservations.push(reservation);
                }
                else if(reservation.status == this.statuses[1]) {
                    this.changedReservations.push(reservation);
                }
                else {
                    this.approvedReservations.push(reservation);
                }
            }
        }
    }

    setReservationCounts() {
        this.newCount = this.newReservations != null ? this.newReservations.length : 0;
        this.changedCount = this.changedReservations != null ? this.changedReservations.length : 0;
        this.approvedCount = this.approvedReservations != null ? this.approvedReservations.length : 0;
    }

    onAcceptClicked(reservation: Reservation) {
        reservation.status = this.statuses[2];
        this.reservationService.updateReservation(reservation).subscribe( response => {
            this.snackbar.open('Successfully Approved ' + reservation.vendorService.serviceName + " For " + reservation.event.userName, '', {
                duration: 3000
            });
            this.ngOnInit();
        });
    }

    onDeclinedClicked(reservation: Reservation) {
        this.reservationService.deleteReservation(reservation).subscribe( response => {
            this.snackbar.open('Successfully Declined ' + reservation.vendorService.serviceName + " For " + reservation.event.userName, '', {
                duration: 3000
            });
            this.ngOnInit();
        });
    }
}