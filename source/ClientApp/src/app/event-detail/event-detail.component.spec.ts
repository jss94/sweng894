import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from '../events/Services/event.service';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MockEventService } from '../events/Services/mock-event.service';
import { RouterTestingModule } from '@angular/router/testing';
import { convertToParamMap } from '@angular/router';
import { Observable, of  } from 'rxjs';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

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
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivedRoute }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
