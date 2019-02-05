import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { EventService } from './Services/event.service';
import { MockEventService } from './Services/mock-event.service';
import { Event } from './Models/event.model';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;

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
      imports: [MaterialModule, ReactiveFormsModule],
      declarations: [ EventComponent],
      providers: [
          { provide: EventService, useClass: MockEventService},
          { provide: AuthService, useClass: MockAuthService }
      ]
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
    spyOn(mockAuthService, 'getUserProfile').and.returnValue(of(fakeUserProfile));
    spyOn(mockEventService, 'getEvents').and.returnValue(of(fakeEvents));

    // act
    fixture.detectChanges();

    // assert
    expect(mockEventService.getEvents).toHaveBeenCalledTimes(1);

     expect(component.events.length).toBe(3);

  }));

});
