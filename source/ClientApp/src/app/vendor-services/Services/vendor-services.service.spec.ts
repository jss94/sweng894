import { TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { VendorServicesService } from './vendor-services.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { FakeUser } from 'src/app/shared/models/fake-user.model';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';

describe('VendorServicesService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
      ],
      providers: [
       { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: []
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: VendorServicesService = TestBed.get(VendorServicesService);
    expect(service).toBeTruthy();
  });
});
