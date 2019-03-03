import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { EventService } from './Services/event.service';
import { MockEventService } from './Services/mock-event.service';
import { AuthService } from '../shared/services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { GuestsComponent } from '../guests/guests.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MockMatDialog } from '../reactivate-user/reactivate-user.component.spec';
import { EmailService } from '../send-email/Services/email.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { InvitationService } from '../invitations/Services/invitation.service';
import { FakeOccEvents } from './Models/fake-occ-event.model';
import { FakeUser } from '../shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let mockEventService: EventService;

  class MockMatSnackBar {
    open() {}
  }

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
      ],
      providers: [
        { provide: MatDialog, userClass: MockMatDialog},
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: EventService, useClass: MockEventService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: () => {} } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockEventService = TestBed.get(EventService);
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all events', fakeAsync(() => {
    // arrange
    spyOn(component, 'setEvents').and.callThrough();

    // act
    fixture.detectChanges();

    // assert
    expect(component.setEvents).toHaveBeenCalledTimes(1);
  }));

  describe('setEvents()', () => {
    it('should populate events property', () => {
      // arrange
      const fakeUser = new FakeUser();
      const fakeEvents = new FakeOccEvents().arr;
      spyOn(mockEventService, 'getEvents').and.returnValue(of(fakeEvents));

      // act
      component.setEvents(fakeUser);

      // assert
      expect(mockEventService.getEvents).toHaveBeenCalledTimes(1);
      expect(component.events[2].description).toEqual(fakeEvents[2].description);
    });
  });
});
