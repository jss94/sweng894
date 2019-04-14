import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from '../events/Services/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockEventService } from '../events/Services/mock-event.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeOccEvent } from '../events/Models/fake-occ-event.model';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { FakeUser } from '../shared/models/fake-user.model';
import { EmailService } from '../send-email/Services/email.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MockMatDialog } from '../nav-menu/nav-menu.component.spec';
import { MockMatSnackBar } from '../deactivate-user/deactivate-user.component.spec';
import { InvitationService } from '../invitations/Services/invitation.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReservationsService } from '../reservations/Services/reservations.service';
import { MockReservationService } from '../reservations/Services/mock-reservation.service';
import { FakeReservation, FakeReservations } from '../reservations/Models/fake-reservation.model';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;
  let mockReservationService: ReservationsService;
  let mockInvitationService: InvitationService;
  let mockSnackbar: MatSnackBar;
  let mockEmailService: EmailService;

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

  class MockInvitationService {
    getInvitation(){}
  }

  class MockEmailService {
    sendVendorQuestionEmail() {
    }

    sendEventInvitationEmail() {
    }

    createEmailModel() {
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailComponent],
      imports: [
        RouterTestingModule,
        RouterModule,
      ],
      providers: [
        { provide: EmailService, useClass: MockEmailService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: InvitationService, useClass: MockInvitationService },
        { provide: EventService, useClass: MockEventService },
        { provide: ActivatedRoute, useClass: MockActivedRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ReservationsService, useClass: MockReservationService }

      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    mockEventService = TestBed.get(EventService);
    mockAuthService = TestBed.get(AuthService);
    mockReservationService = TestBed.get(ReservationsService);
    mockInvitationService = TestBed.get(InvitationService);
    mockSnackbar = TestBed.get(MatSnackBar);
    mockEmailService = TestBed.get(EmailService);
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

  it('should get the reservations', () => {
    // assign
    const fakeReservations = new FakeReservations();
    const fakeReservation = new FakeReservation();
    spyOn(mockReservationService, 'getReservationsByEventGuid').and.returnValue(of(fakeReservations));

    // act
    fixture.detectChanges();

    // assert
    expect(mockReservationService.getReservationsByEventGuid).toHaveBeenCalledTimes(1);
    expect(component.reservations[0]).toEqual(fakeReservations[0]);
  });

  describe('getReservations()', () => {
    it ('should get reservations', () => {
      // arrange
      const fakeReservations = new FakeReservations().arr;
      spyOn(mockReservationService, 'getReservationsByEventGuid').and.returnValue(of(fakeReservations));

      // act
      component.getReservations();

      // assert
      expect(mockReservationService.getReservationsByEventGuid).toHaveBeenCalledTimes(1);

    });
  });

  describe('loadReservation()', () => {
    it ('should load reservation', () => {
      // arrange
      spyOn(component, 'showReservationsDialog').and.callThrough();

      // act
      component.loadReservations(new FakeOccEvent());

      // assert
      expect(component.showReservationsDialog).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadInvite()', () => {
    it ('should load invite', () => {
      // arrange 
      spyOn(mockInvitationService, 'getInvitation').and.returnValue(of({}));
      spyOn(component, 'showInviteDialog').and.callFake(() => {});

      // act
      component.loadInvite(new FakeOccEvent());

      // assert
      expect(mockInvitationService.getInvitation).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayInvitationFeedback', () => {
    it ('should display invitation feedback', () => {
      // arrange
      spyOn(mockSnackbar, 'open').and.callThrough();

      // act
      component.displayInvitationFeedback(200, '', '');

      // assert
      expect(mockSnackbar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayEmailFeedback', () => {
    it ('should display email feedback', () => {
      // arrange
      spyOn(mockSnackbar, 'open').and.callThrough();

      // act
      component.displayEmailFeedback(new FakeOccEvent(), 200);

      // assert
      expect(mockSnackbar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendEmail', () => {
    it ('should send email', () => {
      // arrange
      spyOn(mockEmailService, 'createEmailModel').and.callThrough();
      spyOn(mockEmailService, 'sendEventInvitationEmail').and.callThrough();
      component.invitationModel = {subject: '', eventGuid: '', content: ''}

      // act
      component.sendEmail(new FakeOccEvent());

      // assert
      expect(mockEmailService.createEmailModel).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendEventInvitationEmail).toHaveBeenCalledTimes(1);
    });
  });

});
