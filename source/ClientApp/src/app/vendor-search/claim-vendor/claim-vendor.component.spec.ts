import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule, MatInputModule } from '@angular/material';
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

describe('ClaimVendorComponent', () => {
  let component: ClaimVendorComponent;
  let fixture: ComponentFixture<ClaimVendorComponent>;
  let mockVendorSearchService: VendorSearchService;

  class MockMatSnackBar {
    open() {}
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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: VendorService, userClass: FakeVendorService}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimVendorComponent);
    component = fixture.componentInstance;
    mockVendorSearchService = TestBed.get(VendorSearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
