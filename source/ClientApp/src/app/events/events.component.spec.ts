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
import { MockAuthService } from '../shared/services/mock-auth.service';
import { FakeOccEvents, FakeOccEvent } from './Models/fake-occ-event.model';
import { FakeUser } from '../shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';
import { DatePipe } from '@angular/common';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let mockEventService: EventService;
  let mockAuthService: AuthService;
  let mockDialog: MatDialog;
  let mockSnackbar: MatSnackBar;

  class MockMatDialogRef {
    afterClosed() {
      return of({});
    }
  }

  class MockMatDialog {
    open() {
      return new MockMatDialogRef();
    }
  }
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
        { provide: MatDialog, useClass: MockMatDialog},
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: EventService, useClass: MockEventService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DatePipe, useClass: DatePipe},
        { provide: Router, useValue: { navigate: () => {} } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockEventService = TestBed.get(EventService);
    mockAuthService = TestBed.get(AuthService);
    mockDialog = TestBed.get(MatDialog);
    mockSnackbar = TestBed.get(MatSnackBar);

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all events for user$', fakeAsync(() => {
    // arrange
    spyOnProperty(mockAuthService, 'user').and.returnValue(undefined);
    spyOn(component, 'setEvents').and.callThrough();

    // act
    fixture.detectChanges();

    // assert
    expect(component.setEvents).toHaveBeenCalledTimes(1);
  }));

  it('should display all events for user', fakeAsync(() => {
    // arrange
    const fakeUser = new FakeUser();
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
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

  describe('onCreate()', () => {
    it('should create new event', fakeAsync(() => {
      // arrange
      spyOn(mockEventService, 'createNewEvent').and.returnValue(of(true));
      spyOn(component, 'ngOnInit');;
      spyOn(component, 'createDateWithTime');

      // act
      component.onCreate();

      // assign
      expect(mockEventService.createNewEvent).toHaveBeenCalledTimes(1);
      expect(component.ngOnInit).toHaveBeenCalledTimes(1);
      expect(component.createDateWithTime).toHaveBeenCalledTimes(1);
    }));
  });

  describe('updateEvent()', () => {
    it ('should update event', () => {
      // arrange
      const fakeOccEvent = new FakeOccEvent();
      spyOn(mockEventService, 'updateEvent').and.returnValue(of(true));
      spyOn(component, 'ngOnInit');

      // act
      component.updateEvent('name', 'description', new Date(), fakeOccEvent);

      // assert
      expect(mockEventService.updateEvent).toHaveBeenCalledTimes(1);
      expect(component.ngOnInit).toHaveBeenCalledTimes(1);
    });
  });

  // describe('onEditEventClicked()', () => {
  //   it ('should display popup', () => {
  //     // arrange
  //     spyOn(mockDialog, 'open').and.returnValue(new MockMatDialogRef());

  //     // act
  //     component.onEditEventClicked(new FakeOccEvent());

  //     // assert
  //     expect(mockDialog).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('deleteEvent', () => {
  //   it ('should delete event', () => {
  //     // arrange
  //     spyOn(mockEventService, 'deleteEvent').and.returnValue(of(true));
  //     spyOn(mockSnackbar, 'open').and.returnValue(of(true));
  //     // act
  //     component.deleteEvent(new FakeOccEvent());

  //     // assert
  //     expect(mockEventService.deleteEvent).toHaveBeenCalledTimes(1);
  //     expect(mockSnackbar.open).toHaveBeenCalledTimes(1);
  //   });
  // });
});
