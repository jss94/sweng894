/// <reference types="@types/googlemaps" />

import { Component, OnInit } from '@angular/core';
import { VendorSearchService } from './Services/vendor-search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Router } from '@angular/router';
import { GooglePlacesService } from './Services/google-places.service';
import { of, Subject, Observable, forkJoin } from 'rxjs';
import { GoogleMapsService } from '../google-map/Services/google-maps.service';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: [ './vendor-search.component.css']
})
export class VendorSearchComponent implements OnInit {
  unclaimedServices: VendorServices[];
  claimedServices: VendorServices[];

  map: google.maps.Map;
  geolocation$ = new Subject();
  userName: string;
  markers: google.maps.Marker[] = [];

  searchForm = new FormGroup({
    price: new FormControl(''),
    capacity: new FormControl(''),
    location: new FormControl('', [ Validators.required ]),
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
    private googlePlacesService: GooglePlacesService,
    private googleMapsService: GoogleMapsService,
    ) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.geolocation$.next({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, function(error) {
        console.log(error);
      });

      this.geolocation$.subscribe((location: {lat: number, lng: number}) => {
        this.googlePlacesService.getAddressFromGeolocation(location)
        .subscribe((address) => {
          this.searchForm.controls['location'].setValue(address);
        });
      });
  }

  ngOnInit() {
    this.geolocation$.subscribe((location: {lat: number, lng: number}) => {
      const property = {
        zoom: 12,
        center: location
      };

      this.map = this.googleMapsService.setMap(document.getElementById('search-map'), property);

      const marker = this.googleMapsService.setMarker(location, this.map);
      this.markers.push(marker);
    });
  }

  onSearchClicked() {
    this.searchUnclaimedVendors().subscribe((result) => {
      this.unclaimedServices = result;
    });

    forkJoin(
      this.searchClaimedVendors(),
      this.searchUnclaimedVendors()).subscribe(([claimed, unclaimed]) => {
        this.removeDuplicateVendors(claimed, unclaimed);
      });
  }

  onResetClicked() {
    this.searchForm.reset();
  }

  removeDuplicateVendors(claimed: VendorServices[], unclaimed: VendorServices[]) {

    unclaimed = unclaimed.filter(service => {
      const existingService = claimed
        .find(c => c.googleId === service.googleId);
      // if service doesn't exist then return true and keep the service.
      return existingService === undefined ? true : false;
    });

    this.unclaimedServices = unclaimed;
    this.claimedServices = claimed;
  }

  searchClaimedVendors(): Observable<VendorServices[]> {
    const services = new Subject<VendorServices[]>();

    const properties = {
      maxPrice: this.searchForm.controls['price'].value || 999999,
      maxCapacity: this.searchForm.controls['capacity'].value || 0,
      zip: this.searchForm.controls['location'].value,
      type: this.searchForm.controls['category'].value,
    };
    this.vendorSearchService.searchVendorServices(properties)
    .subscribe(s => {
      services.next(s || []);
    });

    return services;
  }

  searchUnclaimedVendors(): Observable<VendorServices[]> {
    const services = new Subject<VendorServices[]>();
    const address = this.searchForm.controls['location'].value;
    this.googlePlacesService.getGeoLocationFromAddress(address)
      .subscribe((location: {lat: number, lng: number}) => {
        const request = {
          location: location,
          radius: 10000,
          type: this.getCategory()
        };

        this.googlePlacesService.locationSearch(request, this.map).subscribe(results => {
          const vendorServices: VendorServices[] = results.map(loc => {
            return {
              price: 0,
              vendorId: 0,
              googleId: loc.id,
              serviceType: loc.types.toString(),
              serviceName: loc.name,
              serviceDescription: '',
              location: { lat: loc.geometry.location.lat(), lng: loc.geometry.location.lng() }
            };
          });
          services.next(vendorServices);
        });
      });

      return services;
  }

  onClaimClicked(service: VendorServices) {
    const type = this.searchForm.controls['category'].value;
    const lat = service.location.lat;
    const lng = service.location.lng;
    this.router.navigate(['claim-vendor/' + lat + '/' + lng + '/' + type + '/' + service.googleId]);
  }

  onDetailsClicked(service: VendorServices) {
    this.router.navigate(['vendor-details', service.vendorId]);
  }

  getCategory() {
    switch (this.searchForm.controls['category'].value) {
      case 'Flowers': return ['florist'];
      case 'Venue': return ['church', 'hindu_temple', 'mosque', 'synagogue'];
      case 'Catering': return ['meal_delivery'];
      case 'Lodging': return ['lodging'];
      case 'Activites': return ['library'];
      case 'Other': return ['travel_agency'];
      default: return ['car_rental', 'clothing_store', 'hair_care', 'jewelry_store'];
    }
  }
}
