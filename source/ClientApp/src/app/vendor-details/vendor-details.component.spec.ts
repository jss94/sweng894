import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { VendorServicesService } from '../vendor-services/Services/vendor-services.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';
import { VendorDetailsComponent } from './vendor-details.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


describe('VendorDetailsComponent', () => {
  let component: VendorDetailsComponent;
  let fixture: ComponentFixture<VendorDetailsComponent>;
  let mockVendorServicesService: VendorServicesService;
  let mockVendorService: VendorService;
  let mockVendorServices: VendorServices;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
