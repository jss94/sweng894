import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterUserComponent } from './register-user.component';
import { RegisterService } from '../Services/register.service';
import { MockRegisterService } from '../Services/mock-register.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBar, MatExpansionModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../../shared/models/fake-user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { of } from 'rxjs';

describe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;
  let mockRegisterService: MockRegisterService;

  class MockMatSnackBar {
    open() {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterUserComponent,
      ],
      providers: [
        { provide: RegisterService, useClass: MockRegisterService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: AuthService, useClass: MockAuthService },
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
      const fakeUser = new FakeUser();
      spyOn(mockRegisterService, 'registerUser').and.returnValue(of([
        fakeUser,
        {email_verified: true}
      ]));

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

  });

});
