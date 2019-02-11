import { TestBed } from '@angular/core/testing';

import { VendorServicesService } from './vendor-services.service';

describe('VendorServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorServicesService = TestBed.get(VendorServicesService);
    expect(service).toBeTruthy();
  });
});
