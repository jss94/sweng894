import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { EventService } from './Services/profile.service';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../shared/models/fake-user.model';
import { Observable } from 'rxjs';
import { Routes } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { GuestsComponent } from '../guests/guests.component';
import { MatSnackBar } from '@angular/material';
import { MockProfileService } from './Services/mock-profile.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;

  class MockAuthService {
    user$ = of(new FakeUser);

    get(aString: string): Observable<any> {
      return of(new FakeUser);
    }
  }

  class MockMatSnackBar {
    open() {}
  }

  const fakeUserProfile: any = {
    nickname: 'jss94'
  };

  const routes: Routes = [
    { path: 'guests/:id', component: GuestsComponent },
];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
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
        { provide: EventService, useClass: MockProfileService },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockEventService = TestBed.get(EventService);
    mockAuthService = TestBed.get(AuthService);
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all events', fakeAsync(() => {
    // arrange
    spyOn(mockEventService, 'getEvents').and.returnValue(of(fakeEvents));

    // act
    fixture.detectChanges();

    // assert
    expect(mockEventService.getEvents).toHaveBeenCalledTimes(1);
    expect(component.events.length).toBe(3);

  }));

});
