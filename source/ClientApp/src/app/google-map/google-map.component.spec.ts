import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapComponent } from './google-map.component';
import { GoogleMapsService } from './Services/google-maps.service';
import { MockGoogleMapsService } from './Services/mock-google-maps.service';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
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
