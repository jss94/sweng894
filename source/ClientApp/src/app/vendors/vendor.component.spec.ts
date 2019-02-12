import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { VendorComponent } from './vendor.component';
import { VendorService } from './Services/vendor.service';
import { MockVendorService } from './Services/mock-vendor.service';
import { FakeVendors } from '../shared/models/fake-vendor.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

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
    mockVendorService = TestBed.get(VendorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

});
