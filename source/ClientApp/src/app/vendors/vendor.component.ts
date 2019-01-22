import { Component } from '@angular/core';
import { Vendor } from './Models/vendor.model';
import { VendorService } from './Services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html'
})
export class VendorComponent {
  public vendors: Vendor[];

  constructor(private vendorService: VendorService) {
    this.vendorService.getVendors().subscribe((response: Vendor[]) => {
      this.vendors = response;
    });
  }

}
