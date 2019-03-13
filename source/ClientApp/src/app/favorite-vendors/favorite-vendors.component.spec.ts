import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteVendorsComponent } from './favorite-vendors.component';

describe('FavoriteVendorsComponent', () => {
  let component: FavoriteVendorsComponent;
  let fixture: ComponentFixture<FavoriteVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteVendorsComponent ]
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
