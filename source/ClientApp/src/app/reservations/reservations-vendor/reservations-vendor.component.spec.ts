import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { ReservationsVendorComponent } from './reservations-vendor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { ActivatedRoute } from '@angular/router';
import { MockMatSnackBar } from 'src/app/deactivate-user/deactivate-user.component.spec';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MockMatDialog } from 'src/app/nav-menu/nav-menu.component.spec';
import { MockEventService } from 'src/app/events/Services/mock-event.service';
import { EventService } from 'src/app/events/Services/event.service';
import { ReservationsService } from '../Services/reservations.service';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockVendorService } from 'src/app/vendors/Services/mock-vendor.service';
import { FakeVendor } from 'src/app/shared/models/fake-vendor.model';
import { FakeReservations, FakeReservation } from '../Models/fake-reservation.model';
import { MockReservationService } from '../Services/mock-reservation.service';
import { FakeUser } from 'src/app/shared/models/fake-user.model';
import { truncate } from 'fs';

describe('ReservationsVendorComponent', () => {
    let component: ReservationsVendorComponent;
    let fixture: ComponentFixture<ReservationsVendorComponent>;
  
    let mockVendorService: VendorService;
    let mockReservationsService: ReservationsService;
    let mockAuthService: AuthService;

    class MockParam {
      get(params: string): string {
        return '1';
      }
    }
  
    class MockActivatedRoute {
      paramMap = of(new MockParam()) ;
    }
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ReservationsVendorComponent],
        imports: [
          FormsModule,
          ReactiveFormsModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: MatSnackBar, useClass: MockMatSnackBar },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: EventService, useClass: MockEventService },
          { provide: ReservationsService, useClass: MockReservationService },
          { provide: VendorService, useClass: MockVendorService }
        ],
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ReservationsVendorComponent);
      component = fixture.componentInstance;
      mockAuthService = TestBed.get(AuthService);
      mockVendorService = TestBed.get(VendorService);
      mockReservationsService = TestBed.get(ReservationsService);
    });

    it('should create', () => {
      spyOnProperty(mockAuthService, 'user').and.returnValue(new FakeUser());
      expect(component).toBeTruthy();
    });

    describe('setOccasionVendor()', () => {
      it('should set occasions vendor', () => {
        // assign
        const fakeVendor = new FakeVendor();
        spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
        spyOn(component, 'createReservationLists').and.callFake(() => {});

        // act 
        fixture.detectChanges();

        // assert
        expect(mockVendorService.getVendor).toHaveBeenCalledTimes(1);
        expect(component.createReservationLists).toHaveBeenCalledTimes(1);
        expect(component.occasionVendor).toEqual(fakeVendor);
      });
    });

    describe('createReservationLists()', () => {
      it('should set reservations', () => {
        // assign
        const fakeReservations = new FakeReservations().arr;
        spyOn(mockReservationsService, 'getReservationByVendorId').and.returnValue(of(fakeReservations));
        component.occasionVendor = new FakeVendor();

        // act
        component.createReservationLists();

        // assert
        expect(mockReservationsService.getReservationByVendorId).toHaveBeenCalledTimes(1);
        expect(component.reservations).toEqual(fakeReservations);
      });
    });

    describe('onAcceptClicked()', () => {
      it('should accept reservation', () => {
        // assign
        const fakeReservations = new FakeReservations().arr;
        spyOn(mockReservationsService, 'updateReservation').and.returnValue(of(true));
        component.occasionVendor = new FakeVendor();
        spyOn(component, 'ngOnInit').and.callFake(() => {});

        // act
        component.onAcceptClicked(fakeReservations[0]);

        // assert
        expect(mockReservationsService.updateReservation).toHaveBeenCalledTimes(1);
        expect(component.ngOnInit).toHaveBeenCalledTimes(1);
      });
    });

    describe('onDeclinedClicked()', () => {
      it('should accept reservation', () => {
        // assign
        const fakeReservations = new FakeReservations().arr;
        spyOn(mockReservationsService, 'deleteReservation').and.returnValue(of(true));
        spyOn(component, 'ngOnInit').and.callFake(() => {});
        component.occasionVendor = new FakeVendor();

        // act
        component.onDeclinedClicked(fakeReservations[0]);

        // assert
        expect(mockReservationsService.deleteReservation).toHaveBeenCalledTimes(1);
        expect(component.ngOnInit).toHaveBeenCalledTimes(1);
      });
    });

  });
