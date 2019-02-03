import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterUserComponent } from './register-user.component';
import { RegisterService } from '../Services/register.service';
import { MockRegisterService } from '../Services/mock-register.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../../shared/models/fake-user.model';

describe('GetUsers', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;
  let mockRegisterService: MockRegisterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterUserComponent,
      ],
      providers: [
        { provide: RegisterUserComponent, useClass: MockRegisterService },
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
    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    mockRegisterService = TestBed.get(RegisterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddUser', () => {
    it('should call the correct service', () => {
      // arrange
      spyOn(mockRegisterService, 'registerUser').and.callThrough();

      // act
      component.onAddUser();

      // assert
      expect(mockRegisterService.registerUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('form validator', () => {
    it('should catch invalid email', () => {
      // arrange
      const user = new FakeUser();
      user.userName = 'this is not an email@address.com';
      component.userForm.controls['email'].setValue( user.userName );

      // the following are additional required fields in the form
      component.userForm.controls['role'].setValue( user.role );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should catch invalid more than two characters long', () => {
      // arrange
      const user = new FakeUser();
      user.address.state = 'USA';
      component.userForm.controls['state'].setValue( user.address.state );

      // the following are required fields in the form
      component.userForm.controls['email'].setValue( user.userName );
      component.userForm.controls['role'].setValue( user.role );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should catch invalid less than two characters long', () => {
      // arrange
      const user = new FakeUser();
      user.address.state = 'A';
      component.userForm.controls['state'].setValue( user.address.state );

      // the following are required fields in the form
      component.userForm.controls['email'].setValue( user.userName );
      component.userForm.controls['role'].setValue( user.role );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should catch zip less than 5 digits long', () => {
      // arrange
      const user = new FakeUser();
      user.address.zip = 0;
      component.userForm.controls['zip'].setValue( user.address.zip );

      // the following are required fields in the form
      component.userForm.controls['email'].setValue( user.userName );
      component.userForm.controls['role'].setValue( user.role );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should catch zip more than 5 digits long', () => {
      // arrange
      const user = new FakeUser();
      user.address.zip = 100100;
      component.userForm.controls['zip'].setValue( user.address.zip );

      // the following are required fields in the form
      component.userForm.controls['email'].setValue( user.userName );
      component.userForm.controls['role'].setValue( user.role );

      // act
      // done automatically by formgroup object

      // assert
      expect(component.userForm.valid).toBeFalsy();
    });

  });

});
