import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { VendorComponent } from './vendor.component';
import { VendorService } from './Services/vendor.service';
import { MockVendorService } from './Services/mock-vendor.service';
<<<<<<< HEAD
import { FakeVendors } from './Models/fake-vendor.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
=======
import { Vendor } from './Models/vendor.model';
import { of } from 'rxjs';
>>>>>>> 398d378746b4101fea29c0a25c647532bdcd93d0

describe('VendorComponent', () => {
  let component: VendorComponent;
  let fixture: ComponentFixture<VendorComponent>;
  let mockVendorService: VendorService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorComponent ],
      providers: [
          { provide: VendorService, useClass: MockVendorService },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockVendorService = TestBed.get(VendorService);
    fixture = TestBed.createComponent(VendorComponent);
    component = fixture.componentInstance;
<<<<<<< HEAD
    mockVendorService = TestBed.get(VendorService);
=======
>>>>>>> 398d378746b4101fea29c0a25c647532bdcd93d0
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

<<<<<<< HEAD
  describe('getVendors', () => {
    it('should display all vendors', () => {
      // arrange
      const fakeVendors = new FakeVendors();
      spyOn(mockVendorService, 'getVendors').and.returnValue(of(fakeVendors.arr));

      // act
      fixture.detectChanges();

      // assert
      expect(mockVendorService.getVendors).toHaveBeenCalledTimes(1);
      expect(component.vendors.length).toBe(3);

    });
  });

=======
  it('should display all vendors', fakeAsync(() => {
    // arrange
    spyOn(mockVendorService, 'getVendors').and.returnValue(of(fakeVendors));

    // act
    fixture.detectChanges();

    // assert
    expect(mockVendorService.getVendors).toHaveBeenCalledTimes(1);
    expect(component.vendors.length).toBe(2);

  }));
>>>>>>> 398d378746b4101fea29c0a25c647532bdcd93d0
});
