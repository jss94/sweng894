import { TestBed } from '@angular/core/testing';

import { FavoriteVendorsService } from './favorite-vendors.service';

describe('FavoriteVendorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoriteVendorsService = TestBed.get(FavoriteVendorsService);
    expect(service).toBeTruthy();
  });
});
