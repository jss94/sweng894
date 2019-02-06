import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterVendorComponent } from './register-vendor.component';
import { RegisterService } from '../Services/register.service';
import { MockRegisterService } from '../Services/mock-register.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBar } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../../shared/models/fake-user.model';
import { of } from 'rxjs';
import { FakeVendor } from 'src/app/vendors/Models/fake-vendor.model';

describe('RegisterVendorComponent', () => {
  let component: RegisterVendorComponent;
  let fixture: ComponentFixture<RegisterVendorComponent>;
  let mockRegisterService: RegisterService;

  class MockMatSnackbar {
    open() {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterVendorComponent,
      ],
      providers: [
        { provide: RegisterService, useClass: MockRegisterService },
        { provide: MatSnackBar, useClass: MockMatSnackbar},
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddVendor', () => {
    it('should call the correct service', () => {
      // arrange
      const fakeUser = new FakeUser();
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
    it('should catch invalid email', () => {
      // arrange
      const vendor = new FakeVendor();
      vendor.userName = 'this is not an email@address.com';
      component.vendorForm.controls['email'].setValue( vendor.userName );

      // the following are additional required fields in the form
      component.vendorForm.controls['name'].setValue( vendor.name );
      component.vendorForm.controls['type'].setValue( vendor.type );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.vendorForm.valid).toBeFalsy();
    });

    it('should catch invalid more than two characters long', () => {
      // arrange
      const vendor = new FakeVendor();
      vendor.address.state = 'USA';
      component.vendorForm.controls['state'].setValue( vendor.address.state );

      // the following are required fields in the form
      component.vendorForm.controls['email'].setValue( vendor.userName );
      component.vendorForm.controls['name'].setValue( vendor.name );
      component.vendorForm.controls['type'].setValue( vendor.type );

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
      component.vendorForm.controls['email'].setValue( vendor.userName );
      component.vendorForm.controls['name'].setValue( vendor.name );
      component.vendorForm.controls['type'].setValue( vendor.type );
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
      component.vendorForm.controls['email'].setValue( vendor.userName );
      component.vendorForm.controls['name'].setValue( vendor.name );
      component.vendorForm.controls['type'].setValue( vendor.type );

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
      component.vendorForm.controls['email'].setValue( vendor.userName );
      component.vendorForm.controls['name'].setValue( vendor.name );
      component.vendorForm.controls['type'].setValue( vendor.type );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.vendorForm.valid).toBeFalsy();
    });

  });

});