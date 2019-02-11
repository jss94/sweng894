import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FakeUser } from '../shared/models/fake-user.model';
import { Observable } from 'rxjs';
import { GuestsService } from './Services/guests.service';
import { GuestsComponent } from './guests.component';
import { MockGuestsService } from './Services/mock-guests.service';
import { HttpClient } from 'selenium-webdriver/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material';

describe('GuestsComponent', () => {
  let component: GuestsComponent;
  let fixture: ComponentFixture<GuestsComponent>;
  let mockGuestsService: GuestsService;
  let mockAuthService: AuthService;

  class MockMatSnackBar {
    open() {

    }
  }

  class MockAuthService {
    user$ = of(new FakeUser);

    get(aString: string): Observable<any> {
      return of(new FakeUser);
    }
  }

  class MockActivatedRoute {

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: GuestsService, useClass: MockGuestsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockGuestsService = TestBed.get(GuestsService);
    mockAuthService = TestBed.get(AuthService);
    fixture = TestBed.createComponent(GuestsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
