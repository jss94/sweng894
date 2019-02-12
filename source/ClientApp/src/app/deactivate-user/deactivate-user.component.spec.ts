import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateUserComponent } from './deactivate-user.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UsersService } from '../users/Services/users.service';
import { MockUsersService } from '../users/Services/mock-users.service';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';

export class MockSnackBar {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateUserComponent ],
      imports: [
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: UsersService, useClass: MockUsersService },
        { provide: MatSnackBar, useClass: MockSnackBar },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
