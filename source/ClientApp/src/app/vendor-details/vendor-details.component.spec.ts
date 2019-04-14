import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { VendorService } from 'src/app/vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';
import { VendorDetailsComponent } from './vendor-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBar, MatExpansionModule, MatDialog } from '@angular/material';
import { of } from 'rxjs/internal/observable/of';
import { MockMatDialog } from '../deactivate-user/deactivate-user.component.spec';
import { EmailService } from '../send-email/Services/email.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FavoriteVendorsService } from '../favorite-vendors/Services/favorite-vendors.service';
import { MockFavoriteVendorService } from '../favorite-vendors/Services/mock-favorite-vendors.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MockVendorService } from '../vendors/Services/mock-vendor.service';
import { PromotionService } from '../vendor-promotions/Services/promotion.service';
import { FakeVendor } from '../shared/models/fake-vendor.model';
import { VendorServicesService } from '../vendor-services/Services/vendor-services.service';
import { FakeVendorServices, FakeVendorServicesGroup } from '../shared/models/fake-vendor-services.model';
import { FakePromotions } from '../shared/models/fake-promotion.model';
import { FakeUser } from '../shared/models/fake-user.model';

describe('VendorDetailsComponent', () => {
  let component: VendorDetailsComponent;
  let fixture: ComponentFixture<VendorDetailsComponent>;
  let mockAuthService: AuthService;
  let mockVendorSvc: VendorService;
  let mockVendorSvcService: VendorServicesService;
  let mockPromotionService: PromotionService;
  let mockFavoritesService: FavoriteVendorsService;
  let mockSnackBar: MatSnackBar;
  let mockDialog: MatDialog;
  class MockPromotionService {
    getAllPromotions() {

    }
  }

  class MockEmailService {
    sendVendorQuestionEmail() {

    }

    sendEventInvitationEmail() {

    }
  }

  const mockParamMap = {
    get() { return 1; }
  };

  class MockActivedRoute {
    paramMap = of(mockParamMap);
    snapshot = {
        paramMap: mockParamMap
    };
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
    unitsAvailable: null,
    googleId: ''
  };

  const fakeSvcsArray = new Array(fakeService, fakeService, fakeService);


  class MockMatSnackBar {
    open() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDetailsComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivedRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: VendorService, useClass: MockVendorService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: EmailService, useClass: MockEmailService },
        { provide: FavoriteVendorsService, useClass: MockFavoriteVendorService },
        { provide: PromotionService, useClass: MockPromotionService },
      ],
      imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        RouterModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockAuthService = TestBed.get(AuthService);
    mockVendorSvc = TestBed.get(VendorService);
    mockVendorSvcService = TestBed.get(VendorServicesService);
    mockPromotionService = TestBed.get(PromotionService);
    mockFavoritesService = TestBed.get(FavoriteVendorsService);
    mockSnackBar = TestBed.get(MatSnackBar);
    mockDialog = TestBed.get(MatDialog);

    fixture = TestBed.createComponent(VendorDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run setup functions', () => {
    // assign
    spyOn(component, 'setVendor').and.callThrough();
    spyOn(component, 'setFavoriteState').and.callThrough();
    spyOn(component, 'setUserRole').and.callThrough();

    // act
    fixture.detectChanges();

    // assert
    expect(component.setVendor).toHaveBeenCalledTimes(1);
    expect(component.setFavoriteState).toHaveBeenCalledTimes(1);
    expect(component.setUserRole).toHaveBeenCalledTimes(1);
  });

  describe('setVendor', () => {
    it ('should set the vendor variable', () => {
      // assign
      const fakeVendor = new FakeVendor();
      const fakeVendorServices = new FakeVendorServicesGroup().arr;
      const fakePromotions = new FakePromotions().arr;
      spyOn(mockVendorSvc, 'getVendorById').and.returnValue(of(fakeVendor));
      spyOn(mockVendorSvcService, 'getVendorServices').and.returnValue(of(fakeVendorServices));
      spyOn(mockPromotionService, 'getAllPromotions').and.returnValue(of(fakePromotions));

      // act
      component.setVendor();

      // assert
      expect(mockVendorSvc.getVendorById).toHaveBeenCalledTimes(1);
      expect(mockVendorSvcService.getVendorServices).toHaveBeenCalledTimes(1);
      expect(mockPromotionService.getAllPromotions).toHaveBeenCalledTimes(1);
      expect(component.vendorServices).toEqual(fakeVendorServices);
      expect(component.promotions).toEqual(fakePromotions);
    });
  });

  describe('setFavoriteState', () => {
    it ('should set favorites for user$', () => {
      // assign
      const fakeUser = new FakeUser();
      spyOnProperty(mockAuthService, 'user$').and.returnValue(of(fakeUser));
      spyOnProperty(mockAuthService, 'user').and.returnValue(undefined);
      spyOn(mockFavoritesService, 'isVendorAFavorite').and.returnValue(of(true));
      // act
      component.setFavoriteState();

      expect(component.isFavorite).toEqual(true);
    });

    it ('should set favorites for user', () => {
      // assign
      const fakeUser = new FakeUser();
      spyOnProperty(mockAuthService, 'user$').and.returnValue(undefined);
      spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
      spyOn(mockFavoritesService, 'isVendorAFavorite').and.returnValue(of(true));
      // act
      component.setFavoriteState();

      expect(component.isFavorite).toEqual(true);
    });
  });

  describe('setUserRole', () => {
    it ('should set user role', () => {
      // assign
      const fakeUser = new FakeUser();
      spyOnProperty(mockAuthService, 'user$').and.returnValue(of(fakeUser));

      // act
      component.setUserRole();

      // assert
      expect(component.isOrganizer).toEqual(false);
    });
  });

  describe('displayEmailFeedback', () => {
    it ('should display popup', () => {
      // assign
      const fakeVendor = new FakeVendor();
      component.vendor = fakeVendor;
      spyOn(mockSnackBar, 'open').and.callThrough();

      // act
      component.displayEmailFeedback(undefined);

      // assert
      expect(mockSnackBar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadQuestion', () => {
    it ('should load question', () => {
      // assign
      const fakeVendor = new FakeVendor();
      component.vendor = fakeVendor;
      const mockDialogRef = {
        afterClosed() {
          return of({
            data: '',
            content: ''
          });
        }
      };
      spyOn(mockDialog, 'open').and.returnValue(mockDialogRef);

      // act
      component.loadQuestion();

      // assert
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });
  });
});
