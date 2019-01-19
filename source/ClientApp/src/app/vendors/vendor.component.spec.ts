import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorComponent } from './vendor.component';
import { VendorService } from './Services/vendor.service';
import { MockVendorService } from './Services/mockVendor.service';
import { Vendor } from './Models/vendor.model';

describe('MapsComponent', () => {
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
    fixture = TestBed.createComponent(VendorComponent);
    component = fixture.componentInstance;
    mockVendorService = TestBed.get(VendorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all vendors', () => {
    // arrange
    spyOn(mockVendorService, 'getVendors').and.returnValue(fakeVendors);

    // act
    // when constructor is called.

    // assert
    expect(mockVendorService.getVendors).toHaveBeenCalledTimes(1);
    expect(component.vendors.length).toBe(3);

  });
});
