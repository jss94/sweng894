import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
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

describe('UpdateVendorServicesComponent', () => {
  let component: UpdateVendorServicesComponent;
  let fixture: ComponentFixture<UpdateVendorServicesComponent>;

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
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
