import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteVendorsComponent } from './favorite-vendors.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FavoriteVendorsService } from './Services/favorite-vendors.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { MockFavoriteVendorService } from '../favorite-vendors/Services/mock-favorite-vendors.service';

describe('FavoriteVendorsComponent', () => {
  let component: FavoriteVendorsComponent;
  let fixture: ComponentFixture<FavoriteVendorsComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
