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
import { Router, Routes } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FakeGuests, FakeGuest } from './Models/fake.guest.model';

describe('GuestsComponent', () => {
  let component: GuestsComponent;
  let fixture: ComponentFixture<GuestsComponent>;
  let mockGuestsService: GuestsService;
  let mockAuthService: AuthService;


  const routes: Routes = [
    { path: 'guests/:guid', component: GuestsComponent },
  ];
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


  class MockParam {
    get(params: string): string {
      return '1';
    }
  }

  class MockActivatedRoute {
    paramMap = of(new MockParam()) ;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
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

  it('should populate with guests', () => {
    // assign
    const fakeGuests = new FakeGuests().arr;
    spyOn(mockGuestsService, 'getGuests').and.returnValue(of(fakeGuests));

    // act
    fixture.detectChanges();

    // assert
    expect(component.guests).toEqual(fakeGuests);
  });

  describe('onCreate', () => {
    it('shold create user', () => {
      // assign
      const fakeGuest = new FakeGuest();
      component.guestForm.controls['name'].setValue(fakeGuest.name);
      component.guestForm.controls['email'].setValue(fakeGuest.email);
      spyOn(mockGuestsService, 'insert').and.returnValue(of(true));
      spyOn(component.guestForm, 'reset').and.callThrough();

      // act
      component.onCreate();

      // assert
      expect(mockGuestsService.insert).toHaveBeenCalledTimes(1);
      expect(component.guestForm.reset).toHaveBeenCalledTimes(1);
    });
  });
});
