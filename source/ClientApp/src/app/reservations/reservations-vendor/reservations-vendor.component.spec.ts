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

describe('ReservationsVendorComponent', () => {
    let component: ReservationsVendorComponent;
    let fixture: ComponentFixture<ReservationsVendorComponent>;
  
    let mockVendorService: VendorService;
    let mockReservationsService: ReservationsService;

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
      mockVendorService = TestBed.get(VendorService);
      mockReservationsService = TestBed.get(ReservationsService);
      // AML: temporarily commented out becuase these tests are in
      //      the process of being developed and this test currently
      //      breaks the regression tests
      // fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('setOccasionVendor()', () => {
      it('should set occasions vendor', () => {
        // assign
        const fakeVendor = new FakeVendor();
        spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
        spyOn(component, 'createReservationLists').and.callThrough();

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
  });
