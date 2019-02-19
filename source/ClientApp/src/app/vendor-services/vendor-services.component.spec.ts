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

describe('VendorServicesComponent', () => {
  let component: VendorServicesComponent;
  let fixture: ComponentFixture<VendorServicesComponent>;

  const routes: Routes = [
    { path: 'vendors/:id', component: VendorServicesService },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VendorServicesComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService },
        { provide: VendorService, useClass: MockVendorService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
      imports: [RouterTestingModule.withRoutes(routes),
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
