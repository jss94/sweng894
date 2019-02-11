import { Component, OnInit } from '@angular/core';
import { Vendor } from '../shared/models/vendor.model';
import { VendorService } from './Services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html'
})
export class VendorComponent implements OnInit {
  public vendors: Vendor[];

  constructor(private vendorService: VendorService) {
  }

  ngOnInit() {
    this.vendorService.getVendors().subscribe((response: Vendor[]) => {
      this.vendors = response;
    });
  }
}
