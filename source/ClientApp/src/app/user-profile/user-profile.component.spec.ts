import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../shared/models/fake-user.model';
import { Routes } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { GuestsComponent } from '../guests/guests.component';
import { MatSnackBar } from '@angular/material';
import { MockUserProfileService } from './Services/mock-user-profile.service';
import { UserProfileService } from './Services/user-profile.service';
import { FakeVendor } from '../shared/models/fake-vendor.model';
import { MockAuthService } from '../shared/services/mock-auth.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserProfileService: UserProfileService;
  let mockAuthService: AuthService;

  class MockMatSnackBar {
    open() {}
  }

  const routes: Routes = [
    { path: 'guests/:id', component: GuestsComponent },
];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserProfileComponent,
        GuestsComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: UserProfileService, useClass: MockUserProfileService },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockUserProfileService = TestBed.get(UserProfileService);
    mockAuthService = TestBed.get(AuthService);
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display vendor profile', fakeAsync(() => {
    // arrange
    const user = new FakeUser();
    user.role = 'VENDOR';
    const vendor = new FakeVendor();
    spyOnProperty(mockAuthService, 'user').and.returnValue(user);
    spyOn(mockUserProfileService, 'getVendor').and.returnValue(of(vendor));
    spyOn(component, 'setUserProfile').and.callThrough();
    spyOn(component, 'setVendorProfile').and.callThrough();
    spyOn(component, 'setOrganizerProfile').and.callThrough();

    // act
    fixture.detectChanges();

    // assert
    expect(component.setOrganizerProfile).toHaveBeenCalledTimes(0);
    expect(component.setUserProfile).toHaveBeenCalledTimes(1);
    expect(component.setVendorProfile).toHaveBeenCalledTimes(1);
    expect(mockUserProfileService.getVendor).toHaveBeenCalledTimes(1);
    expect(component.profileForm.controls['name'].value).toBe(user.name);

  }));

  it('should display organizer profile', fakeAsync(() => {
    // arrange
    const user = new FakeUser();
    user.role = 'ORGANIZER';
    const vendor = new FakeVendor();
    spyOnProperty(mockAuthService, 'user$').and.returnValue(of(user));
    spyOn(mockUserProfileService, 'getOrganizer').and.returnValue(of(user));

    // act
    fixture.detectChanges();

    // assert
    expect(mockUserProfileService.getOrganizer).toHaveBeenCalledTimes(1);
    expect(component.profileForm.controls['name'].value).toBe(user.name);

  }));

});
