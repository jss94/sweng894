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
    organizerId: 'organizerId',
    description: 'fake description',
    name: 'event name',
    eventDateTime: '2019/04/01',
    eventId: 0,
    guestListId: 0,
    eventCreated: 'null'
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
    mockEventService = TestBed.get(EventService);
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all events for organizer', fakeAsync => {
    // arrange
    spyOn(mockEventService, 'getEvents').and.returnValue({ subscribe: () => fakeEvents });

    fixture = TestBed.createComponent(EventComponent);

    // assert
    expect(mockEventService.getEvents).toHaveBeenCalledTimes(1);

     expect(component.events.length).toBe(2);

  });
});
