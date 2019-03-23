import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FakeOccEvents } from '../../events/Models/fake-occ-event.model';
import { FakeUser } from '../../shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';
import { ReserveComponent } from './reserve.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockMatSnackBar } from 'src/app/deactivate-user/deactivate-user.component.spec';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MockMatDialog } from 'src/app/nav-menu/nav-menu.component.spec';
import { EmailService } from 'src/app/send-email/Services/email.service';
import { MockEventService } from 'src/app/events/Services/mock-event.service';
import { EventService } from 'src/app/events/Services/event.service';
import { MockGuestsService } from 'src/app/guests/Services/mock-guests.service';
import { GuestsService } from 'src/app/guests/Services/guests.service';
import { ReservationsService } from '../Services/reservations.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailModel } from 'src/app/send-email/Models/email.model';
import { EmailAddress } from 'src/app/send-email/Models/email.address.model';
import { Router, ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { Observable } from 'rxjs';
import { MockVendorService } from 'src/app/vendors/Services/mock-vendor.service';
import { FakeVendorServices } from 'src/app/shared/models/fake-vendor-services.model';
import { VendorServicesService } from 'src/app/vendor-services/Services/vendor-services.service';


describe('ReserveComponent', () => {
  let component: ReserveComponent;
  let fixture: ComponentFixture<ReserveComponent>;
  let mockAuthService: AuthService;
  let mockReservationSvc: ReservationsService;
  let mockVendorService: VendorService;
  let mockVendorServicesSvc: VendorServicesService;
  let location: Location;

  class MockMatSnackBar {
    open() { }
  }

  class MockEmailService { }
  
  class MockReservationService { }
  
  const fakeService: VendorServices = {
    id: 1,
    vendorId: 1,
    serviceType: 'Venue',
    serviceName: 'Fake venue',
    serviceDescription: 'Fake venue description',
    flatFee: true,
    price: 200.00,
    unitsAvailable: null,
    googleId: ''
  };

  const mockParamMap = {
    get() {}
  };

  class MockActivedRoute {
    paramMap = of(mockParamMap);
    snapshot = {
        paramMap: mockParamMap
    };
  }


  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ReserveComponent],
      imports: [FormsModule,
        ReactiveFormsModule,],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivedRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: EmailService, useClass: MockEmailService },
        { provide: EventService, useClass: MockEventService },
        { provide: GuestsService, useClass: MockGuestsService },
        { provide: ReservationsService, useClass: MockReservationService },
        { provide: Router, useValue: { navigate: () => { } } },
        { provide: Location, useValue: Location },
      ],
    }).compileComponents();
  });

  


  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });









});
