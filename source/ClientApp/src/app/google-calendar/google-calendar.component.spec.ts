import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleCalendarComponent } from './google-calendar.component';

describe('GoogleMapComponent', () => {
  let component: GoogleCalendarComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let mockMapService: GoogleMapsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapComponent ],
      providers: [
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    mockMapService = TestBed.get(GoogleMapsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
