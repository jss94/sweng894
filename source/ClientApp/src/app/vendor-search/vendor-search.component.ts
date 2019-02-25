import { Component, OnInit } from '@angular/core';
import { VendorSearchService } from './Services/vendor-search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: [ './vendor-search.component.css']
})
export class VendorSearchComponent implements OnInit {
  vendorServices: VendorServices[];

  userName: string;

  searchForm = new FormGroup({
    price: new FormControl(''),
    capacity: new FormControl(''),
    zip: new FormControl('', [ Validators.required ]),
    category: new FormControl('', [ Validators.required]),
  });

  svcs = [
    {
      value: 'Venue',
      viewValue: 'Venue'
    },
    {
      value: 'Catering',
      viewValue: 'Catering'
    },
    {
      value: 'Flowers',
      viewValue: 'Flowers'
    },
    {
      value: 'Supplies',
      viewValue: 'Supplies'
    },
    {
      value: 'Lodging',
      viewValue: 'Lodging'
    },
    {
      value: 'Activities',
      viewValue: 'Activities'
    },
    {
      value: 'Other',
      viewValue: 'Other'
    },
  ];

  constructor(
    private router: Router,
    private vendorSearchService: VendorSearchService,
    ) {
  }

  ngOnInit() {
    this.searchForm.controls['zip'].disable();

  }

  onSearchClicked() {
    const properties = {
      maxPrice: this.searchForm.controls['price'].value || 999999,
      maxCapacity: this.searchForm.controls['capacity'].value || 0,
      zip: this.searchForm.controls['zip'].value,
      type: this.searchForm.controls['category'].value,
    };

    this.vendorSearchService.searchVendorServices(properties).subscribe((result) => {
      console.log(result);
      this.vendorServices = result;
    }, error => {
      console.log('SEARCH ERROR', error);
    });
  }

  onResetClicked() {
    this.searchForm.reset();
  }

  onViewClicked(service: VendorServices) {
    this.router.navigate(['vendor-details/' + service.vendorId]);
  }
}
