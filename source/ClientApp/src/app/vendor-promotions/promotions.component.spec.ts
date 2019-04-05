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

describe('PromotionsComponent', () => {
  let component: PromotionsComponent;
  let fixture: ComponentFixture<PromotionsComponent>;

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
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the promotions of the vendor', () => {

    // act
    spyOn(component, 'setPromotions').and.callThrough();
    /*
    spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
    spyOn(mockPromotionService, 'getAllPromotions').and.returnValue(of(fakePromotions));
*/
    // act
    fixture.detectChanges();

    // assert
    expect(component.setPromotions).toHaveBeenCalledTimes(1);
  });

});
