import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterVendorComponent } from './register-vendor.component';
import { RegisterService } from '../Services/register.service';
import { MockRegisterService } from '../Services/mock-register.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBar } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../../shared/models/fake-user.model';
import { FakeVendor } from 'src/app/shared/models/fake-vendor.model';
import { of } from 'rxjs/internal/observable/of';
import { GuestsComponent } from 'src/app/guests/guests.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';

describe('RegisterVendorComponent', () => {
  let component: RegisterVendorComponent;
  let fixture: ComponentFixture<RegisterVendorComponent>;
  let mockRegisterService: RegisterService;
  let mockAuthService: AuthService;

  class MockMatSnackbar {
    open() {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterVendorComponent,
        GuestsComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: RegisterService, useClass: MockRegisterService },
        { provide: MatSnackBar, useClass: MockMatSnackbar },
        { provide: Router, useValue: { navigate: () => {} } }
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVendorComponent);
    component = fixture.componentInstance;
    mockRegisterService = TestBed.get(RegisterService);
    mockAuthService = TestBed.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddVendor', () => {
    it('should call the correct service', () => {
      // arrange
      const fakeUser = new FakeUser();
      spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
      spyOn(mockRegisterService, 'registerVendor').and.returnValue(of([
        fakeUser,
        {email_verified: true}
      ]));

      // act
      component.onAddVendor();

      // assert
      expect(mockRegisterService.registerVendor).toHaveBeenCalledTimes(1);
    });
  });

  describe('form validator', () => {

    it('should catch invalid more than two characters long', () => {
      // arrange
      const vendor = new FakeVendor();
      vendor.address.state = 'USA';
      component.vendorForm.controls['state'].setValue( vendor.address.state );

      // the following are required fields in the form
      component.vendorForm.controls['name'].setValue( vendor.name );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.vendorForm.valid).toBeFalsy();
    });

    it('should catch invalid less than two characters long', () => {
      // arrange
      const vendor = new FakeVendor();
      vendor.address.state = 'A';
      component.vendorForm.controls['state'].setValue( vendor.address.state );

      // the following are required fields in the form
      component.vendorForm.controls['name'].setValue( vendor.name );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.vendorForm.valid).toBeFalsy();
    });

    it('should catch zip less than 5 digits long', () => {
      // arrange
      const vendor = new FakeVendor();
      vendor.address.zip = 0;
      component.vendorForm.controls['zip'].setValue( vendor.address.zip );

      // the following are required fields in the form
      component.vendorForm.controls['name'].setValue( vendor.name );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.vendorForm.valid).toBeFalsy();
    });

    it('should catch zip more than 5 digits long', () => {
      // arrange
      const vendor = new FakeVendor();
      vendor.address.zip = 100100;
      component.vendorForm.controls['zip'].setValue( vendor.address.zip );

      // the following are required fields in the form
      component.vendorForm.controls['name'].setValue( vendor.name );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.vendorForm.valid).toBeFalsy();
    });

  });

});
