import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../shared/models/fake-user.model';
import { Observable } from 'rxjs';
import { GuestsService } from './Services/guests.service';
import { GuestsComponent } from './guests.component';
import { MockGuestsService } from './Services/mock-guests.service';
import { HttpClient } from 'selenium-webdriver/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FakeGuests, FakeGuest } from './Models/fake.guest.model';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MockEventService } from '../events/Services/mock-event.service';
import { EventService } from '../events/Services/event.service';
import { FakeOccEvent } from '../events/Models/fake-occ-event.model';
import { MockMatDialog } from '../reactivate-user/reactivate-user.component.spec';

describe('GuestsComponent', () => {
  let component: GuestsComponent;
  let fixture: ComponentFixture<GuestsComponent>;
  let mockGuestsService: GuestsService;
  let mockAuthService: AuthService;
  let mockEventService: EventService;


  const routes: Routes = [
    { path: 'guests/:guid', component: GuestsComponent },
  ];
  class MockMatSnackBar {
    open() {

    }
  }

  class MockParam {
    get(params: string): string {
      return '1';
    }
  }

  class MockActivatedRoute {
    paramMap = of(new MockParam()) ;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: GuestsService, useClass: MockGuestsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: EventService, useClass: MockEventService },
        { provide: MatDialog, userClass: MockMatDialog},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockGuestsService = TestBed.get(GuestsService);
    mockAuthService = TestBed.get(AuthService);
    mockEventService = TestBed.get(EventService);
    fixture = TestBed.createComponent(GuestsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate with guests', () => {
    // assign
    const fakeGuests = new FakeGuests().arr;
    const mockEvent = new FakeOccEvent();

    spyOn(mockAuthService, 'user$').and.returnValue(of(new FakeUser()));
    spyOn(mockGuestsService, 'getGuests').and.returnValue(of(fakeGuests));
    spyOn(mockEventService, 'getEvent').and.returnValue(of(mockEvent));

    // act
    fixture.detectChanges();

    // assert
    expect(component.guests).toEqual(fakeGuests);
  });

  describe('onCreate', () => {
    it('should create user', () => {
      // assign
      const fakeGuest = new FakeGuest();
      const mockEvent = new FakeOccEvent();
      component.guestForm.controls['name'].setValue(fakeGuest.name);
      component.guestForm.controls['email'].setValue(fakeGuest.email);
      spyOn(mockGuestsService, 'insert').and.returnValue(of(true));
      spyOn(component.guestForm, 'reset').and.callThrough();
      spyOn(mockEventService, 'getEvent').and.returnValue(of(mockEvent));


      // act
      component.onCreate();

      // assert
      expect(mockGuestsService.insert).toHaveBeenCalledTimes(1);
      expect(component.guestForm.reset).toHaveBeenCalledTimes(1);
    });
  });
});
