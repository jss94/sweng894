import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { EventsComponent } from './vendor-search.component';
import { EventService } from './Services/vendor-search.service';
import { MockEventService } from './Services/mock-vendor-search.service';
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
import { MatSnackBar, MatDialog } from '@angular/material';
import { MockMatDialog } from '../reactivate-user/reactivate-user.component.spec';
import { EmailService } from '../send-email/Services/email.service';
import { EmailModel } from '../send-email/Models/email.model';
import { MockAuthService } from '../shared/services/mock-auth.service';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;
  let mockEmailService: EmailService;

  class MockMatSnackBar {
    open() {}
  }

  class MockEmailService {
    sendVendorQuestionEmail(vendorId: number, emailModel: EmailModel) {

    }

    sendEventInvitationEmail(eventId: number, emailModel: EmailModel) {

    }
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

  const routes: Routes = [
    { path: 'guests/:id', component: GuestsComponent },
  ];

  let fakeMatDialog: MatDialog;

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
        { provide: EmailService, useClass: MockEmailService },
        { provide: MatDialog, useClass: MockMatDialog },
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
    fakeMatDialog = TestBed.get(MatDialog);
    mockEmailService = TestBed.get(EmailService);
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
