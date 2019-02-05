import { Component, OnInit } from '@angular/core';
import { Vendor } from './Models/vendor.model';
import { VendorService } from './Services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html'
})
export class VendorComponent implements OnInit {
  public vendors: Vendor[];

  constructor(private vendorService: VendorService) {
<<<<<<< HEAD

=======
>>>>>>> 398d378746b4101fea29c0a25c647532bdcd93d0
  }

  ngOnInit() {
    this.vendorService.getVendors().subscribe((response: Vendor[]) => {
      this.vendors = response;
    });
  }
}
