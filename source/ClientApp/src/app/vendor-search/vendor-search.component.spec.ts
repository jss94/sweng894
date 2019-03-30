import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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
import { Subject } from 'rxjs';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';

describe('VendorSearchComponent', () => {
  let component: VendorSearchComponent;
  let fixture: ComponentFixture<VendorSearchComponent>;
  let mockVendorSearchService: VendorSearchService;
  let mockGooglePlacesService: GooglePlacesService;

  const unclaimed: VendorServices[] = [
    {
      vendorId: 1,
      googleId: '123',
      serviceType: 'vendor',
      serviceName: 'Trador Joes',
      serviceDescription: 'Place for stuff',
      price: 1
    },
    {
      vendorId: 2,
      googleId: '456',
      serviceType: 'vendor',
      serviceName: 'Trador Joes',
      serviceDescription: 'Place for stuff',
      price: 1
    },
  ];
  const claimed: VendorServices[] = [
    {
      vendorId: 1,
      googleId: '123',
      serviceType: 'vendor',
      serviceName: 'Trador Joes',
      serviceDescription: 'Place for stuff',
      price: 1,
      unitsAvailable: 100,
    },
    {
      vendorId: 2,
      googleId: '111',
      serviceType: 'vendor',
      serviceName: 'Trador Joes',
      serviceDescription: 'Place for stuff',
      price: 1,
      unitsAvailable: 100,
    },
    {
      vendorId: 3,
      googleId: '222',
      serviceType: 'vendor',
      serviceName: 'Trador Joes',
      serviceDescription: 'Place for stuff',
      price: 1,
      unitsAvailable: 100,
    },
  ];

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
    mockGooglePlacesService = TestBed.get(GooglePlacesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchClicked()', () => {
    it ('should return search results', fakeAsync(() => {
        // arrange
        const fakeVendorServices = new FakeVendorServicesGroup().arr;
        spyOn(component, 'searchUnclaimedVendors').and.returnValue(of(unclaimed));
        spyOn(component, 'searchClaimedVendors').and.returnValue(of(claimed));
        spyOn(component, 'removeClaimedVendors').and.callThrough();

        component.searchForm.controls['price'].setValue(999);
        component.searchForm.controls['capacity'].setValue(99);

        // act
        component.onSearchClicked();

        // assert
        expect(component.searchUnclaimedVendors).toHaveBeenCalledTimes(1);
        expect(component.searchClaimedVendors).toHaveBeenCalledTimes(1);
        expect(component.removeClaimedVendors).toHaveBeenCalledTimes(1);
        expect(component.claimedServices.length).toBe(3);
        expect(component.unclaimedServices.length).toBe(1);
    }));
  });

  describe('populateLocationClicked', () => {
    it ('should call getLocationFromBrowser()', () => {
      // arrange
      spyOn(component, 'getLocationFromBrowser').and.callThrough();

      // act
      component.populateLocationClicked();

      // assert
      expect(component.getLocationFromBrowser).toHaveBeenCalledTimes(1);
    });

    it ('should add marker to map', async(() => {
      // arrange

      // act
      component.populateLocationClicked();
      component.geolocation$.next({lat: 5, lng: 5});

      // assert
      expect(component.markers.length).toBe(1);
    }));
  });

  describe('getLocationFromBrowser()', () => {
    it ('should return location of browser', fakeAsync(() => {
      // arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callThrough();
      spyOn(mockGooglePlacesService, 'getAddressFromGeolocation').and.returnValue(of('My Address'));

      // act
      component.getLocationFromBrowser();
      component.geolocation$.next({lat: 5, lng: 5});

      // assert
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(component.searchForm.controls['location'].value).toBe('My Address');
    }));
  });

  describe('removeDuplicateVendors()', () => {
    it ('should remove duplicate vendors', () => {
      // arrange

      // act
      component.removeClaimedVendors(claimed, unclaimed);

      // assert
      expect(component.claimedServices.length).toBe(3);
      expect(component.unclaimedServices.length).toBe(1);
    });
  });

  describe('searchClaimedVendors()', () => {
    it ('should get a list of claimed vendors', async((done) => {
      // arrange
      spyOn(mockVendorSearchService, 'searchVendorServices').and.returnValue(of(claimed));

      // act
      const result = component.searchClaimedVendors(['ddd']);

      // assert
      expect(mockVendorSearchService.searchVendorServices).toHaveBeenCalledTimes(1);

      // the following does not work.
      result.subscribe((services) => {
        expect(services.length).toBe(1);
        done();
      });
    }));
  });

  describe('searchUnclaimedVendors()', () => {
    it('should get a list of unclaimed vendors', async((done) => {
      // arrange
      const locations = [
        {
          place_id: '123',
          types: {},
          vicinity: 'description 1'
        },
        {
          place_id: '456',
          types: {},
          vicinity: 'description 2'
        }
      ];
      spyOn(mockGooglePlacesService, 'getGeoLocationFromAddress').and.returnValue(of({lat: 5, lng: 5}));
      spyOn(mockGooglePlacesService, 'locationSearch').and.returnValue(of(locations));

      // act
      const result = component.searchUnclaimedVendors();

      // assert
      // the following needs to be fixed.
      result.subscribe(services => {
        expect(services).toBe(unclaimed);
        done();
      });
    }));
  });

});
