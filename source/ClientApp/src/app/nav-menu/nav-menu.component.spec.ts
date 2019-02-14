import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { AuthService } from '../shared/services/auth.service';
import { MatMenuModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { NavMenuComponent } from './nav-menu.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeUser } from '../shared/models/fake-user.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export class MockMatDialogRef {
  afterClosed() {
    return of({});
  }
}

export class MockMatDialog {
  open() {
    return new MockMatDialogRef();
  }
}

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavMenuComponent
      ],
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        RouterModule,
        MatMenuModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set admin flag', fakeAsync(() => {
    // assign
    const user = new FakeUser();
    user.role = 'ADMIN';
    spyOnProperty(authService, 'user$').and.returnValue(of(user));

    // act
    fixture.detectChanges();

    // assert
    expect(component.isOrganizer).toEqual(true);
    expect(component.isVendor).toEqual(true);
  }));

  it('should set only vendor flag', fakeAsync(() => {
    // assign
    const user = new FakeUser();
    user.role = 'VENDOR';
    spyOnProperty(authService, 'user$').and.returnValue(of(user));

    // act
    fixture.detectChanges();

    // assert
    expect(component.isOrganizer).toEqual(false);
    expect(component.isVendor).toEqual(true);
  }));

  it('should set only organizer flag', fakeAsync(() => {
    // assign
    const user = new FakeUser();
    user.role = 'ORGANIZER';
    spyOnProperty(authService, 'user$').and.returnValue(of(user));

    // act
    fixture.detectChanges();

    // assert
    expect(component.isOrganizer).toEqual(true);
    expect(component.isVendor).toEqual(false);
  }));
});
