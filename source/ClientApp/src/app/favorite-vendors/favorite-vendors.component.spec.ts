import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteVendorsComponent } from './favorite-vendors.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FavoriteVendorsService } from './Services/favorite-vendors.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MockFavoriteVendorService } from '../favorite-vendors/Services/mock-favorite-vendors.service';
import { FakeUser } from '../shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';
import { FakeVendors, FakeVendor } from '../shared/models/fake-vendor.model';
import { MockReservationService } from '../reservations/Services/mock-reservation.service';

describe('FavoriteVendorsComponent', () => {
  let component: FavoriteVendorsComponent;
  let fixture: ComponentFixture<FavoriteVendorsComponent>;
  let mockAuthService: AuthService;
  let mockFavoriteVendorService: FavoriteVendorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteVendorsComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: FavoriteVendorsService, useClass: MockFavoriteVendorService },
      ],
      imports: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteVendorsComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.get(AuthService);
    mockFavoriteVendorService = TestBed.get(FavoriteVendorsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create for user$', () => {
    // assign
    spyOnProperty(mockAuthService, 'user').and.returnValue(undefined);
    spyOnProperty(mockAuthService, 'user$').and.returnValue(of(new FakeUser()));
    spyOn(component, 'getFavoriteVendors').and.callFake(() => {});

    // act
    fixture.detectChanges();

    // assert
    expect(component.getFavoriteVendors).toHaveBeenCalledTimes(1);
  });

  it('should create for user', () => {
    // assign
    spyOnProperty(mockAuthService, 'user').and.returnValue(new FakeUser());
    spyOn(component, 'getFavoriteVendors').and.callFake(() => {});

    // act
    fixture.detectChanges();

    // assert
    expect(component.getFavoriteVendors).toHaveBeenCalledTimes(1);
  });

  describe('getFavoriteVendors', () => {
    it ('should get favorite vendors', () => {
      // assign
      const fakeVendors = new FakeVendors().arr;
      spyOn(mockFavoriteVendorService, 'getFavoriteVendors').and.returnValues(of(fakeVendors));

      // act
      component.getFavoriteVendors(new FakeUser);

      // assert
      expect(mockFavoriteVendorService.getFavoriteVendors).toHaveBeenCalledTimes(1);
      expect(component.favoriteVendors).toEqual(fakeVendors);
    });
  });

  describe('onDeleteFavorite', () => {
    it ('should delete favorite vendors', () => {
      // assign
      const fakeVendors = new FakeVendors().arr;
      spyOn(mockFavoriteVendorService, 'deleteFavoriteVendor').and.returnValues(of(true));
      spyOn(component, 'ngOnInit').and.callFake(() => {});
      // act
      component.onDeleteFavorite(new FakeVendor());

      // assert
      expect(mockFavoriteVendorService.deleteFavoriteVendor).toHaveBeenCalledTimes(1);
    });
  });
});
