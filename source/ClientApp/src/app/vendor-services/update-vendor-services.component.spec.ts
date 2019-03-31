import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateVendorServicesComponent } from './update-vendor-services.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatSnackBar, MatSelectModule, MatFormFieldModule, MatInputModule, MatExpansionModule } from '@angular/material';
import { MockMatDialog } from '../reactivate-user/reactivate-user.component.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FakeUser } from '../shared/models/fake-user.model';
import { AuthService } from '../shared/services/auth.service';
import { MockAuthService } from '../shared/services/mock-auth.service';
import { VendorServicesService } from './Services/vendor-services.service';
import { MockMatSnackBar } from '../deactivate-user/deactivate-user.component.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockVendorServicesService } from './Services/mock-vendor-services-service';
import { FakeVendorServices } from '../shared/models/fake-vendor-services.model';
import { of } from 'rxjs';

describe('UpdateVendorServicesComponent', () => {
  let component: UpdateVendorServicesComponent;
  let fixture: ComponentFixture<UpdateVendorServicesComponent>;
  let mockVendorServicesService: VendorServicesService;

  const routes: Routes = [
    { path: 'vendors/:id', component: VendorServicesService },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateVendorServicesComponent],
      imports: [
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: VendorServicesService, useClass: MockVendorServicesService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVendorServicesComponent);
    component = fixture.componentInstance;
    mockVendorServicesService = TestBed.get(VendorServicesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable flat fee', () => {
    // assign

    // act
    // fixture.detectChanges();

    // assert
  });

  it('should enble flat fee', () => {
    // assign
    component.updateVendorServiceForm.controls['serviceFlatFee'].valueChanges.subscribe(
      (value) => {
        if (value) {
          component.updateVendorServiceForm.controls['serviceUnitsAvailable'].disable();
          component.updateVendorServiceForm.controls['serviceUnitsAvailable'].setValue('');
       } else {
        component
        }
      }
    );

    // act
    // fixture.detectChanges();

    // assert
  });

  it('should populate vendor forms', () => {
    const FakeService = new FakeVendorServices();
    component.updateVendorServiceForm.controls['serviceFlatFee'].setValue(true);
    spyOn(mockVendorServicesService, 'getVendorServiceById').and.returnValue(FakeService);

    // act
    fixture.detectChanges();

    // assert
    expect(mockVendorServicesService.getVendorServiceById).toHaveBeenCalledTimes(1);
  });

 

});
