import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent as UsersComponent } from './users.component';
import { UsersService } from './Services/users.service';
import { MockUsersService } from './Services/mock-users.service';
import { FakeUser } from '../shared/models/fake-user.model';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBar, MatExpansionModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';

describe('GetUsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUsersService: UsersService;

  class MockMatSnackBar {
    open() {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UsersComponent,
      ],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        NoopAnimationsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    mockUsersService = TestBed.get(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddUser', () => {
    it('should call the correct service', () => {
      // arrange
      spyOn(mockUsersService, 'registerUser').and.returnValue(of({id: 0}));

      // act
      component.onAddUser();

      // assert
      expect(mockUsersService.registerUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('form validator', () => {
    it('should catch invalid email', () => {
      // arrange
      spyOn(mockUsersService, 'registerUser').and.returnValue(of({id: 0}));
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
