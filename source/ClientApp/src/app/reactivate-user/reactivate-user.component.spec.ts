import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ReactivateUserComponent } from './reactivate-user.component';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { UsersService } from '../users/Services/users.service';
import { MockUsersService } from '../users/Services/mock-users.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';

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

describe('ReactivateUserComponent', () => {
  let component: ReactivateUserComponent;
  let fixture: ComponentFixture<ReactivateUserComponent>;
  let authService: AuthService;
  let usersService: UsersService;
  let fakeMatDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactivateUserComponent ],
      imports: [
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: UsersService, useClass: MockUsersService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateUserComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    usersService = TestBed.get(UsersService);
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
