import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { EventService } from './Services/event.service';
import { MockEventService } from './Services/mock-event.service';
import { OccEvent } from './Models/occ-event.model';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../shared/models/fake-user.model';
import { Observable } from 'rxjs';
import { Router, Routes } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { GuestsComponent } from '../guests/guests.component';
import { MatSnackBar } from '@angular/material';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
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

  const fakeEvent: OccEvent = {
    userName: 'organizerId',
    description: 'fake description',
    name: 'event name',
    dateTime: '2019/04/01',
    eventId: 0,
    guestListId: 0,
    created: 'null'
  };

  const fakeEvents: OccEvent[] = [
    fakeEvent,
    fakeEvent,
    fakeEvent,
  ];

  const fakeUserProfile: any = {
    nickname: 'jss94'
  };

  const routes: Routes = [
    { path: 'guests/:id', component: GuestsComponent },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventsComponent,
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
        { provide: EventService, useClass: MockEventService },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockEventService = TestBed.get(EventService);
    mockAuthService = TestBed.get(AuthService);
    fixture = TestBed.createComponent(EventsComponent);
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
