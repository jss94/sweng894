import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { VendorComponent } from './vendor.component';
import { VendorService } from './Services/vendor.service';
import { MockVendorService } from './Services/mock-vendor.service';
import { Vendor } from './Models/vendor.model';
import { of } from 'rxjs';

describe('VendorComponent', () => {
  let component: VendorComponent;
  let fixture: ComponentFixture<VendorComponent>;
  let mockVendorService: VendorService;

  const fakeVendor: Vendor = {
    guid: 'aaaa-bbbb',
    name: 'vendor1',
    description: 'description1',
  };

  const fakeVendors: Vendor[] = [
      fakeVendor,
      fakeVendor,
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorComponent ],
      providers: [
          { provide: VendorService, useClass: MockVendorService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockVendorService = TestBed.get(VendorService);
    fixture = TestBed.createComponent(VendorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all vendors', fakeAsync(() => {
    // arrange
    spyOn(mockVendorService, 'getVendors').and.returnValue(of(fakeVendors));

    // act
    fixture.detectChanges();

    // assert
    expect(mockVendorService.getVendors).toHaveBeenCalledTimes(1);
    expect(component.vendors.length).toBe(2);

  }));
});
