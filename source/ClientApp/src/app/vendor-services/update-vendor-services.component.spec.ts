import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVendorServicesComponent } from './update-vendor-services.component';

describe('UpdateVendorServicesComponent', () => {
  let component: UpdateVendorServicesComponent;
  let fixture: ComponentFixture<UpdateVendorServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateVendorServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVendorServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
