import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FakeOccEvents, FakeOccEvent } from '../../events/Models/fake-occ-event.model';
import { FakeUser } from '../../shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';
import { ReserveComponent } from './reserve.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockMatSnackBar, MockMatDialog } from 'src/app/deactivate-user/deactivate-user.component.spec';
import { MatSnackBar, MatDialog } from '@angular/material';
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
import { MockVendorSearchService } from 'src/app/vendor-search/Services/mock-vendor-search.service';
import { MockVendorServicesService } from 'src/app/vendor-services/Services/mock-vendor-services-service';


describe('ReserveComponent', () => {
  let component: ReserveComponent;
  let fixture: ComponentFixture<ReserveComponent>;
  let mockAuthService: AuthService;
  let mockReservationSvc: ReservationsService;
  let mockVendorServicesSvc: VendorServicesService;
  let location: Location;
  let mockEventService: EventService;
  let mockEmailService: EmailService;
  let mockGuestService: GuestsService;

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
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivedRoute },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: EmailService, useClass: MockEmailService },
        { provide: VendorServicesService, useClass: MockVendorServicesService },
        { provide: EventService, useClass: MockEventService },
        { provide: GuestsService, useClass: MockGuestsService },
        { provide: ReservationsService, useClass: MockReservationService },
        { provide: Location, useValue: Location },
        { provide: Router, useValue: { navigate: () => { } } },
      ],
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.get(AuthService);
    mockEmailService = TestBed.get(EmailService);
    mockVendorServicesSvc = TestBed.get(VendorServicesService);
    mockEventService = TestBed.get(EventService);
    mockGuestService = TestBed.get(GuestsService);
    mockReservationSvc = TestBed.get(ReservationsService);  
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user', () => {
    // assign
    const fakeUser = new FakeUser();
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser); 
    
    const fakeService = new FakeVendorServices();
    spyOn(mockVendorServicesSvc, 'getVendorServiceById').and.returnValue(of(fakeService));

    const fakeEvent = new FakeOccEvent();
    spyOn(mockEventService, 'getEvents').and.returnValue(of(fakeEvent));
    
    
    // act
    fixture.detectChanges();

    // assert
    expect(component.userName).toEqual(fakeUser.userName);

  });




});
