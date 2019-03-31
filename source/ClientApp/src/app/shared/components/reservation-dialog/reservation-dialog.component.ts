import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Reservation } from 'src/app/reservations/Models/reservation.model';
import { ReservationsService } from 'src/app/reservations/Services/reservations.service';


export interface ReservationDialogData {
  title: string;
  reservations: Reservation[];
  iconName: string;
}

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})

export class ReservationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: ReservationDialogData,
    private reservationsService: ReservationsService
  ) { }

  ngOnInit() {

  }

  onClick(affirm: boolean): void {
    this.dialogRef.close({});
  }

  deleteReservation(reservation: Reservation) {
    debugger
    this.reservationsService.deleteReservation(reservation).subscribe(() => {
      const index = this.data.reservations.indexOf(reservation, 0);
      if (index > -1) {
        this.data.reservations.splice(index, 1);
      }
    });
  }
}
