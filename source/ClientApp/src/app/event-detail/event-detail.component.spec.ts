import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from '../events/Services/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockEventService } from '../events/Services/mock-event.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeOccEvent, FakeOccEvents } from '../events/Models/fake-occ-event.model';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { FakeUser } from '../shared/models/fake-user.model';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;

  class MockActivedRoute {
    public snapshot = {
      paramMap: {
        eventId: 'abc123',
        userName: 'd31e8b48-7309-4c83-9884-4142efdf7271',
         get(param: string): string {
          return 'mock';
        }
      }
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailComponent],
      imports: [
        RouterTestingModule,
        RouterModule,
      ],
      providers: [
        { provide: EventService, useClass: MockEventService },
        { provide: ActivatedRoute, useClass: MockActivedRoute },
        { provide: AuthService, useClass: MockAuthService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    mockEventService = TestBed.get(EventService);
    mockAuthService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the details of the event', () => {
    // assign
    const fakeEvent = new FakeOccEvent();
    const fakeUser = new FakeUser();
    spyOn(mockEventService, 'getEvent').and.returnValue(of(fakeEvent));
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);

    // act
    fixture.detectChanges();

    // assert
    expect(mockEventService.getEvent).toHaveBeenCalledTimes(1);
    expect(component.theEvent.name).toEqual(fakeEvent.name);

  });
});
