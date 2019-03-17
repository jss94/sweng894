import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { GuestsComponent } from '../guests/guests.component';
import { MatDialog, MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MockMatDialog } from '../reactivate-user/reactivate-user.component.spec';
import { EmailModel } from '../send-email/Models/email.model';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { VendorSearchComponent } from './vendor-search.component';
import { VendorSearchService } from './Services/vendor-search.service';
import { FakeVendorServicesGroup } from '../shared/models/fake-vendor-services.model';
import { MockVendorSearchService } from './Services/mock-vendor-search.service';
import { GooglePlacesService } from './Services/google-places.service';
import { MockGoogleMapsService } from '../google-map/Services/mock-google-maps.service';
import { MockGooglePlacesService } from './Services/mock-google-places.service';
import { GoogleMapsService } from '../google-map/Services/google-maps.service';

describe('VendorSearchComponent', () => {
  let component: VendorSearchComponent;
  let fixture: ComponentFixture<VendorSearchComponent>;
  let mockVendorSearchService: VendorSearchService;

  class MockMatSnackBar {
    open() {}
  }

  class MockEmailService {
    sendVendorQuestionEmail(vendorId: number, emailModel: EmailModel) {

    }

    sendEventInvitationEmail(eventId: number, emailModel: EmailModel) {

    }
  }


  const routes: Routes = [
    { path: 'guests/:id', component: GuestsComponent },
  ];

  let fakeMatDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VendorSearchComponent,
        GuestsComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatInputModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
        { provide: GooglePlacesService, useClass: MockGooglePlacesService },
        { provide: VendorSearchService, useClass: MockVendorSearchService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSearchComponent);
    component = fixture.componentInstance;
    fakeMatDialog = TestBed.get(MatDialog);
    mockVendorSearchService = TestBed.get(VendorSearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchClicked()', () => {
    it ('should return search results', fakeAsync(() => {
        // arrange
        const fakeVendorServices = new FakeVendorServicesGroup().arr;
        spyOn(component, 'searchUnclaimedVendors').and.returnValue(of(fakeVendorServices));
        spyOn(component, 'searchClaimedVendors').and.returnValue(of(fakeVendorServices));

        // act
        component.onSearchClicked();

        // assert
        expect(component.searchUnclaimedVendors).toHaveBeenCalledTimes(1);
        expect(component.searchClaimedVendors).toHaveBeenCalledTimes(1);
        expect(component.claimedServices.length).toBe(3);
        // expect(component.unclaimedServices.length).toBe(3);
    }));
  });
});
