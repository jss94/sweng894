import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { VendorServicesComponent } from './vendor-services.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { MockVendorService } from '../vendors/Services/mock-vendor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { VendorServicesService } from './Services/vendor-services.service';
import { MockMatSnackBar } from '../deactivate-user/deactivate-user.component.spec';
import { MatSnackBar } from '@angular/material';
import { FakeUser } from '../shared/models/fake-user.model';
import { FakeVendor } from '../shared/models/fake-vendor.model';
import { of } from 'rxjs';
import { FakeVendorServices, FakeVendorServicesGroup } from '../shared/models/fake-vendor-services.model';
import { MockVendorServicesService } from './Services/mock-vendor-services-service';
import { VendorServices } from '../shared/models/vendor-services.model';

describe('VendorServicesComponent', () => {
  let component: VendorServicesComponent;
  let fixture: ComponentFixture<VendorServicesComponent>;
  let mockAuthService: AuthService;
  let mockVendorService: VendorService;
  let mockVendorServicesService: VendorServicesService;

  const routes: Routes = [
    { path: 'vendors/:id', component: VendorServicesService },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VendorServicesComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: VendorService, useClass: MockVendorService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: VendorServicesService, useClass: MockVendorServicesService },
      ],
      imports: [RouterTestingModule.withRoutes(routes),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorServicesComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.get(AuthService);
    mockVendorService = TestBed.get(VendorService);
    mockVendorServicesService = TestBed.get(VendorServicesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user', () => {
    // assign
    component.vendorServiceForm.controls['serviceFlatFee'].setValue(true);
    const fakeUser = new FakeUser();
    const fakeVendor = new FakeVendor();
    const fakeVendors = new FakeVendorServicesGroup().arr;
    spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
    spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
    spyOn(mockVendorServicesService, 'getVendorServices').and.returnValue(of(fakeVendors));

    // act
    fixture.detectChanges();

    // assert
    expect(component.vendorServiceForm.controls['serviceUnitsAvailable'].value).toEqual('');
    expect(mockVendorService.getVendor).toHaveBeenCalledTimes(1);
    expect(component.vendorId).toEqual(fakeVendor.id);
    expect(component.vendorServices).toEqual(fakeVendors);
    expect(component.userName).toEqual(fakeUser.userName);
  });

  it('should set user$', () => {
    // assign
    component.vendorServiceForm.controls['serviceFlatFee'].setValue(true);
    const fakeUser = new FakeUser();
    const fakeVendor = new FakeVendor();
    const fakeVendors = new FakeVendorServicesGroup().arr;
    spyOnProperty(mockAuthService, 'user').and.returnValue(null);
    spyOn(mockAuthService, 'user$').and.returnValue(fakeUser);
    spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
    spyOn(mockVendorServicesService, 'getVendorServices').and.returnValue(of(fakeVendors));

    // act
    fixture.detectChanges();

    // assert
    expect(component.vendorServiceForm.controls['serviceUnitsAvailable'].value).toEqual('');
    expect(mockVendorService.getVendor).toHaveBeenCalledTimes(1);
    expect(component.vendorId).toEqual(fakeVendor.id);
    expect(component.vendorServices).toEqual(fakeVendors);
  });

  describe('onCreate()', () => {
    it('should create service', () => {
      //arrange
      const svc = new FakeVendorServices();
      component.vendorId = 1;
      spyOn(mockVendorServicesService, 'createNewVendorService').and.returnValue(of(svc));
      spyOn(component.vendorServiceForm, 'reset').and.callThrough();

      //arrange for nginit
      component.vendorServiceForm.controls['serviceFlatFee'].setValue(true);
      const fakeUser = new FakeUser();
      const fakeVendor = new FakeVendor();
      const fakeVendors = new FakeVendorServicesGroup().arr;
      spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
      spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
     
      // act
      component.onCreate();

      // assert
      expect(mockVendorServicesService.createNewVendorService).toHaveBeenCalledTimes(1);
      expect(component.vendorServiceForm.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('onDelete()', () => {
    it('should remove service', () => {
      //arrange
      component.vendorId = 1;
      spyOn(mockVendorServicesService, 'deleteVendorService').and.returnValue(of(true));
      spyOn(component.vendorServiceForm, 'reset').and.callThrough();

      //arrange for nginit
      component.vendorServiceForm.controls['serviceFlatFee'].setValue(true);
      const fakeUser = new FakeUser();
      const fakeVendor = new FakeVendor();
      const fakeVendors = new FakeVendorServicesGroup().arr;
      spyOnProperty(mockAuthService, 'user').and.returnValue(fakeUser);
      spyOn(mockVendorService, 'getVendor').and.returnValue(of(fakeVendor));
     
      const svc = new FakeVendorServices();
      
      // act
      component.onDelete(svc);

      // assert
      expect(mockVendorServicesService.deleteVendorService).toHaveBeenCalledTimes(1);
      expect(component.vendorServiceForm.reset).toHaveBeenCalledTimes(1);
    });
  });

});
