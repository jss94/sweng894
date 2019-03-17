import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('ReservationsVendorComponent', () => {
    let component: ReservationsVendorComponent;
    let fixture: ComponentFixture<ReservationsVendorComponent>;
  
    class MockParam {
      get(params: string): string {
        return '1';
      }
    }
  
    class MockActivatedRoute {
      paramMap = of(new MockParam()) ;
    }
  
    class MockReservationService { }

    class MockVendorServices { }
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ReservationsVendorComponent],
        imports: [FormsModule,
          ReactiveFormsModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: MatSnackBar, useClass: MockMatSnackBar },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: EventService, useClass: MockEventService },
          { provide: ReservationsService, useClass: MockReservationService },
          { provide: VendorService, useClass: MockVendorServices }
        ],
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ReservationsVendorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });