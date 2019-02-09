import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateUserComponent } from './reactivate-user.component';

describe('DeactivateUserComponent', () => {
  let component: DeactivateUserComponent;
  let fixture: ComponentFixture<DeactivateUserComponent>;
  let mockMapService: GoogleMapsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateUserComponent ],
      providers: [
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateUserComponent);
    component = fixture.componentInstance;
    mockMapService = TestBed.get(GoogleMapsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
