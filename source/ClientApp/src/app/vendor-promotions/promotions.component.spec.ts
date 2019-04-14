import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MatSnackBar, MatExpansionModule, MatDatepickerModule, MatSelectModule, MatIconModule, MatNativeDateModule, MatInputModule } from '@angular/material';
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
import { MockPromotionService } from './Services/mock-promotion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PromotionsComponent', () => {
  let component: PromotionsComponent;
  let fixture: ComponentFixture<PromotionsComponent>;
  let mockAuthService: AuthService;
  let mockVendorService: VendorService;
  let mockPromotionService: PromotionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PromotionsComponent, 
        
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatSelectModule,
        MatIconModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        MatInputModule,
      ],
      providers: [
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: VendorService, useClass: MockVendorService },
        { provide: PromotionService, useClass: MockPromotionService},
        { provide: AuthService, useClass: MockAuthService },
        { provide: DatePipe, useClass: DatePipe },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
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

  it('should get the promotions of the vendor from user', () => {
    const fakeUser = new FakeUser();

    // assign
    spyOn(component, 'setPromotions').and.callThrough();
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);

    // act
    fixture.detectChanges();

    // assert
    expect(component.setPromotions).toHaveBeenCalledTimes(1);
  });

  it('should get the promotions of the vendor from user$', () => {
    const fakeUser = new FakeUser();

    // assign
    spyOn(component, 'setPromotions').and.callThrough();
    spyOnProperty(mockAuthService, 'user').and.returnValue(undefined);
    spyOnProperty(mockAuthService, 'user$').and.returnValue(of(fakeUser));

    // act
    fixture.detectChanges();

    // assert
    expect(component.setPromotions).toHaveBeenCalledTimes(1);
  });

  describe('setPromotions', () => {
    it ('should set promotions from vendor', () => {
      // assign
      const fakeVendor = new FakeVendor();
      const fakeUser = new FakeUser();
      const fakePromotions = new FakePromotions().arr;
      spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
      spyOn(mockPromotionService, 'getAllPromotions').and.returnValue(of(fakePromotions));

      // act
      component.setPromotions(fakeUser);

      // assert
      expect(component.vendorId).toEqual(fakeVendor.id);
      expect(component.promotions).toEqual(fakePromotions);
    });
  });

});
