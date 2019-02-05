import { TestBed } from '@angular/core/testing';
import { VendorService } from './vendor.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { FakeUsers, FakeUser } from 'src/app/shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';

describe('VendorService', () => {

  let sut: VendorService; // System under test
  let mockAuthService: AuthService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      providers: [
        VendorService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });
  });

  beforeEach(() => {
    mockAuthService = TestBed.get(AuthService);
    sut = new VendorService(mockAuthService);
  });

  it('should be created.', () => {
    expect(sut).toBeTruthy();
  });

  describe('getVendors()', () => {
    it('should return correct vendors', (done) => {
      // arrange
      const fakeUsers = new FakeUsers();
      spyOn(mockAuthService, 'get').and.returnValue(of(fakeUsers.arr));

      // act
      sut.getVendors().subscribe((result) => {
        // assert
        expect(mockAuthService.get).toHaveBeenCalledTimes(1);
        expect(result[2].userName).toEqual(fakeUsers.arr[2].userName);
        done();
      });

    });
  });

  describe('getVendor()', () => {
    it('should return correct vendor', (done) => {
      // arrange
      const fakeUser = new FakeUser();
      spyOn(mockAuthService, 'get').and.returnValue(of(fakeUser));

      // act
      sut.getVendor(fakeUser.userName).subscribe((result) => {

        // assert
        expect(mockAuthService.get).toHaveBeenCalledTimes(1);
        expect(result.userName).toEqual(fakeUser.userName);
        done();
      });

    });
  });
});

