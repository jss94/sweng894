import { TestBed } from '@angular/core/testing';

import { FavoriteVendorsService } from './favorite-vendors.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';

describe('FavoriteVendorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useClass: MockAuthService }
    ]
  }));

  it('should be created', () => {
    const service: FavoriteVendorsService = TestBed.get(FavoriteVendorsService);
    expect(service).toBeTruthy();
  });
});
