import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { DeactivateUserComponent } from './deactivate-user.component';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { UsersService } from '../users/Services/users.service';
import { MockUsersService } from '../users/Services/mock-users.service';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { Router, Routes } from '@angular/router';
import { VendorServicesService } from '../vendor-services/Services/vendor-services.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'user-profile', component: UserProfileComponent },
];

export class MockMatSnackBar {
  open() {

  }
}
export class MockMatDialogRef {
  afterClosed() {
    return of({});
  }
}

export class MockMatDialog {
  open(a: any, b: any) {
    return new MockMatDialogRef();
  }
}

describe('DeactivateUserComponent', () => {
  let component: DeactivateUserComponent;
  let fixture: ComponentFixture<DeactivateUserComponent>;
  let fakeMatSnackBar: MatSnackBar;
  let fakeMatDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeactivateUserComponent,
        UserProfileComponent,
      ],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: UsersService, useClass: MockUsersService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateUserComponent);
    component = fixture.componentInstance;
    fakeMatSnackBar = TestBed.get(MatSnackBar);
    fakeMatDialog = TestBed.get(MatDialog);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request user response', fakeAsync(() => {
    // assign
    spyOn(fakeMatDialog, 'open').and.returnValue(new MockMatDialogRef);

    // act
    fixture.detectChanges();

    // assert
    expect(fakeMatDialog.open).toHaveBeenCalledTimes(1);
  }));
});
