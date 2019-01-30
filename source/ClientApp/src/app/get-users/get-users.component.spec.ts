import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GetUsersComponent } from './get-users.component';
import { GetUsersService } from './Services/get-users.service';
import { MockGetUsersService } from './Services/mock-get-users.service';
import { FakeUser } from './Models/fake-user.model';

import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GetUsers', () => {
  let component: GetUsersComponent;
  let fixture: ComponentFixture<GetUsersComponent>;
  let mockUsersService: GetUsersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GetUsersComponent,
      ],
      providers: [
        { provide: GetUsersService, useClass: MockGetUsersService },
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
    fixture = TestBed.createComponent(GetUsersComponent);
    component = fixture.componentInstance;
    mockUsersService = TestBed.get(GetUsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddUser', () => {
    it('should call the correct service', () => {
      // arrange
      spyOn(mockUsersService, 'registerUser').and.callThrough();

      // act
      component.onAddUser();

      // assert
      expect(mockUsersService.registerUser).toHaveBeenCalledTimes(1);
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
