import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventComponent } from './event.component';
import { EventService } from './Services/event.service';
import { MockEventService } from './Services/mock-event.service';
import { Event } from './Models/event.model';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;
  let mockEventService: EventService;

  const fakeEvent: Event = {
    organizerId: 'aaaa-bbbb',
    description: 'fake description',
    name: 'event name',
    eventDate: '2019/04/01',
    eventId: 1234,
    guestListId: null,
    eventCreated: null
  };

  const fakeEvents: Event[] = [
    fakeEvent,
      fakeEvent,
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventComponent ],
      providers: [
          { provide: EventService, useClass: MockEventService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    mockEventService = TestBed.get(EventService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all events', () => {
    // arrange
    spyOn(mockEventService, 'getEvents').and.returnValue(fakeEvents);

    // act
    // when constructor is called.

    // assert
    expect(mockEventService.getEvents).toHaveBeenCalledTimes(1);
    expect(component.events.length).toBe(3);

  });
});
