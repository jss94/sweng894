import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationDialogComponent, ReservationDialogData } from './reservation-dialog.component';
import { Component, OnInit, Inject } from '@angular/core';
import { Reservation } from 'src/app/reservations/Models/reservation.model';
import { ReservationsService } from 'src/app/reservations/Services/reservations.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { MockMatDialog, MockMatDialogRef } from '../../../reactivate-user/reactivate-user.component.spec';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';
import { FakeOccEvent } from 'src/app/events/Models/fake-occ-event.model';
import { FakeReservations, FakeReservation } from 'src/app/reservations/Models/fake-reservation.model';
import { USE_VALUE } from '@angular/core/src/di/injector';
import { MockReservationService } from 'src/app/reservations/Services/mock-reservation.service';

export class MockMatDialogRefEvent extends MockMatDialogRef {
  result: any;
  close(dialogResult: any): void { this.result = dialogResult; }
}

describe('ReservationDialogComponent', () => {
  let component: ReservationDialogComponent;
  let fixture: ComponentFixture<ReservationDialogComponent>;

  // AML
  let mockDialogRef: MockMatDialogRefEvent;

  // AML
  let data: ReservationDialogData;
  let eut: FakeOccEvent;
  eut = new FakeOccEvent();
  data = {
    iconName: 'event_available',
    title: eut.name,
    reservations: new FakeReservations().arr
  };

  let mockResService: ReservationsService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReservationDialogComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        // { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatDialogRef, useClass: MockMatDialogRefEvent },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: ReservationsService, useValue: MockReservationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockDialogRef = TestBed.get(MatDialogRef);
    mockResService = TestBed.get(ReservationsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
