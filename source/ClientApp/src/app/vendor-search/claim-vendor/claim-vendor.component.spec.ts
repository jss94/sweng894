import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule, MatInputModule, MatSnackBar } from '@angular/material';
import { ClaimVendorComponent } from './claim-vendor.component';
import { VendorSearchService } from '../Services/vendor-search.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { Observable } from 'rxjs/internal/Observable';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { unescapeIdentifier } from '@angular/compiler';
import { MockVendorSearchService } from '../Services/mock-vendor-search.service';
import { GooglePlacesService } from '../Services/google-places.service';
import { MockGooglePlacesService } from '../Services/mock-google-places.service';
import { GoogleMapsService } from 'src/app/google-map/Services/google-maps.service';
import { MockGoogleMapsService } from 'src/app/google-map/Services/mock-google-maps.service';
import { FakeVendor } from 'src/app/shared/models/fake-vendor.model';

describe('ClaimVendorComponent', () => {
  let component: ClaimVendorComponent;
  let fixture: ComponentFixture<ClaimVendorComponent>;
  let mockVendorSearchService: VendorSearchService;
  let fakeAuthService: AuthService;
  let fakeGooglePlacesService: GooglePlacesService;

  class MockMatSnackBar {
    open() {}
  }

  class MockActiveRoute {
    snapshot = {
      paramMap: {
        get: function(id: string) {
          return undefined;
        }
      }
    };
  }

  class MockVendorService {
    getVendors(): Observable<Vendor[]> {
      return of(undefined);
    }

    getVendor(userName: string): Observable<Vendor> {
        return of(undefined);
    }

    getVendorById(vendorId: number): Observable<Vendor> {
        return of(undefined);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClaimVendorComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatInputModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActiveRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: VendorService, useClass: MockVendorService },
        { provide: VendorSearchService, useClass: MockVendorSearchService },
        { provide: GooglePlacesService, useClass: MockGooglePlacesService },
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimVendorComponent);
    component = fixture.componentInstance;
    mockVendorSearchService = TestBed.get(VendorSearchService);
    fakeAuthService = TestBed.get(AuthService);
    fakeGooglePlacesService = TestBed.get(GooglePlacesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set role', () => {
    // arrange
    const fakeVendor = new FakeVendor();
    spyOn(fakeAuthService, 'user').and.returnValue(undefined);
    spyOn(component, 'setOccasionsVendor').and.callThrough();
    spyOn(fakeGooglePlacesService, 'getVendorById').and.returnValue(of(fakeVendor));

    // act
    fixture.detectChanges();

    // assert
    expect(component.setOccasionsVendor).toHaveBeenCalledTimes(1);
  });

});
