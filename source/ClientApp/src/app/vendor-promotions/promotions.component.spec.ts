import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MatSnackBar } from '@angular/material';
import { MockMatSnackBar } from '../deactivate-user/deactivate-user.component.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PromotionsComponent } from './promotions.component';
import { PromotionService } from './Services/promotion.service';
import { MockVendorService } from '../vendors/Services/mock-vendor.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { DatePipe } from '@angular/common';
import { FakeVendor } from '../shared/models/fake-vendor.model';
import { of } from 'rxjs';
import { FakeUser } from '../shared/models/fake-user.model';
import { FakePromotions } from '../shared/models/fake-promotion.model';

describe('PromotionsComponent', () => {
  let component: PromotionsComponent;
  let fixture: ComponentFixture<PromotionsComponent>;
  let mockAuthService: AuthService;
  let mockVendorService: VendorService;
  let mockPromotionService: PromotionService;
  // let fakeVendor: FakeVendor;
  // let fakeUser: FakeUser;
  // let fakePromotions: FakePromotions;

  class MockPromotionService {
    getAllPromotions() {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionsComponent],
      imports: [
        RouterTestingModule,
        RouterModule,
      ],

      providers: [
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: VendorService, useClass: MockVendorService },
        { provide: PromotionService, useClass: MockPromotionService},
        { provide: AuthService, useClass: MockAuthService },
        { provide: DatePipe, useClass: DatePipe },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionsComponent);
    mockAuthService = TestBed.get(AuthService);
    mockVendorService = TestBed.get(VendorService);
    mockPromotionService = TestBed.get(PromotionService);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the promotions of the vendor', () => {
    const fakeVendor = new FakeVendor();
    const fakeUser = new FakeUser();
    const fakePromotions = new FakePromotions();

    // act
    spyOn(component, 'setPromotions').and.callThrough();

    spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
    spyOnProperty(mockAuthService, 'user$').and.returnValue(of(fakeUser));
    spyOn(mockPromotionService, 'getAllPromotions').and.returnValue(of(fakePromotions.arr));
    // act
    fixture.detectChanges();

    // assert
    expect(component.setPromotions).toHaveBeenCalledTimes(1);
  });

});
