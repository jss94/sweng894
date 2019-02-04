import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { EventService } from './Services/event.service';
import { MockEventService } from './Services/mock-event.service';
import { Event } from './Models/event.model';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../shared/models/fake-user.model';
import { Observable } from 'rxjs';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;

  class MockAuthService {
    user$ = of(new FakeUser);

    get(aString: string): Observable<any> {
      return of(new FakeUser);
    }
  }

  const fakeEvent: Event = {
    organizerUserName: 'organizerId',
    eventDescription: 'fake description',
    eventName: 'event name',
    eventDateTime: '2019/04/01',
    eventId: 0,
    guestListId: 0,
    eventCreated: 'null'
  };

  const fakeEvents: Event[] = [
    fakeEvent,
    fakeEvent,
    fakeEvent,
  ];

  const fakeUserProfile: any = {
    nickname: 'jss94'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
          { provide: EventService, useClass: MockEventService},
          { provide: AuthService, useClass: MockAuthService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockEventService = TestBed.get(EventService);
    mockAuthService = TestBed.get(AuthService);
    fixture = TestBed.createComponent(EventComponent);
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
