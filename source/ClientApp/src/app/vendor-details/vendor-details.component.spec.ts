import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeUser } from '../shared/models/fake-user.model';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';
import { VendorDetailsComponent } from './vendor-details.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBar, MatExpansionModule, MatDialog } from '@angular/material';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { MockMatDialog } from '../deactivate-user/deactivate-user.component.spec';
import { EmailService } from '../send-email/Services/email.service';

describe('VendorDetailsComponent', () => {
  let component: VendorDetailsComponent;
  let fixture: ComponentFixture<VendorDetailsComponent>;
  let mockAuthService: AuthService;
  let mockVendorSvc: VendorService;

  class MockEmailService {
    sendVendorQuestionEmail() {

    }

    sendEventInvitationEmail() {

    }
  }

  const mockParamMap = {
    get() {}
  };

  class MockActivedRoute {
      paramMap = of(mockParamMap);
  }

  const fakeAddress: Address = {
    userName: 'vendor@example.com',
    street: '123 Main St.',
    city: 'State College',
    state: 'PA',
    zip: 16801
  };

  const fakeService: VendorServices = {
    id: 1,
    vendorId: 1,
    serviceType: 'Venue',
    serviceName: 'Fake venue',
    serviceDescription: 'Fake venue description',
    flatFee: true,
    price: 200.00,
    unitsAvailable: null
  };

  const fakeSvcsArray = new Array(fakeService, fakeService, fakeService);

  const fakeVendor: Vendor = {
    id: 1,
    userName: 'vendor@example.com',
    name: 'Fake vendor',
    website: 'www.psu.edu',
    phone: '212-555-1212',
    address: fakeAddress,
    services: fakeSvcsArray
  };

  class MockMatSnackBar {
    open() {}
  }

  class MockAuthService {
    user$ = of(new FakeUser);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDetailsComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivedRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: VendorService, useClass: VendorService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: EmailService, useClass: MockEmailService },
      ],
      imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockAuthService = TestBed.get(AuthService);
    mockVendorSvc = TestBed.get(VendorService);
    fixture = TestBed.createComponent(VendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
