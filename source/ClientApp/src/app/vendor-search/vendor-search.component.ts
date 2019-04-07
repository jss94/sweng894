/// <reference types="@types/googlemaps" />

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { VendorSearchService } from './Services/vendor-search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Router } from '@angular/router';
import { GooglePlacesService } from './Services/google-places.service';
import { of, Subject, Observable, forkJoin } from 'rxjs';
import { GoogleMapsService } from '../google-map/Services/google-maps.service';
import { AuthService } from '../shared/services/auth.service';
import { FavoriteVendorsService } from '../favorite-vendors/Services/favorite-vendors.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: [ './vendor-search.component.css']
})
export class VendorSearchComponent implements OnInit, AfterViewInit {
  unclaimedServices: VendorServices[];
  claimedServices: VendorServices[];
  isVendor: boolean;
  userFavorites: Set<number>;
  refresh: any;

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
    private authService: AuthService,
    private router: Router,
    private vendorSearchService: VendorSearchService,
    private googlePlacesService: GooglePlacesService,
    private googleMapsService: GoogleMapsService,
    private favoriteServicesService: FavoriteVendorsService,
    ) {


  }

  ngOnInit() {
    if (this.googlePlacesService.lastSearch !== undefined) {
      this.searchForm = this.googlePlacesService.lastSearch;
      this.onSearchClicked();
    }

    if (this.authService.user) {
      this.isVendor = this.authService.user.role === 'Admin' || this.authService.user.role === 'VENDOR';
      this.userName = this.authService.user.userName;
      this.getFavorites();
    } else {
      this.authService.user$.subscribe(user => {
        this.isVendor = user.role === 'Admin' || user.role === 'VENDOR';
        this.userName = user.userName;
        this.getFavorites();
      });
    }

    this.userFavorites = new Set<number>();
  }

  getFavorites() {
    this.favoriteServicesService.getFavoriteVendors(this.userName).subscribe(response => {
      response.forEach(vendor => {
        this.userFavorites.add(vendor.id);
      });
    });
  }

  ngAfterViewInit() {
    const property = {
      zoom: 12,
      center: {lat: 0, lng: 0},
    };

    const mapElement = document.getElementById('search-map');
    this.map = this.googleMapsService.setMap(mapElement, property);
  }

  getLocationFromBrowser() {
    this.searchForm.controls['location'].disable();

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
        this.searchForm.controls['location'].enable();
        this.searchForm.controls['location'].setValue(address);
      });
    });
  }

  populateLocationClicked() {
    this.getLocationFromBrowser();

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
    this.saveSearchCriteria();

    this.searchUnclaimedVendors().subscribe(unclaimed => {
      const googleIds = unclaimed.map(service => service.googleId);
      this.searchClaimedVendors(googleIds).subscribe(claimed => {
        this.removeClaimedVendors(claimed, unclaimed);
      });
    });
  }

  saveSearchCriteria() {
    this.googlePlacesService.lastSearch = this.searchForm;
  }

  onResetClicked() {
    this.searchForm.reset();
  }

  removeClaimedVendors(claimed: VendorServices[], unclaimed: VendorServices[]) {
    const maxPrice = this.searchForm.controls['price'].value || 999999;
    const maxCapacity = this.searchForm.controls['capacity'].value || 0;

    unclaimed = unclaimed.filter(service => {
      const existingService = claimed
        .find(c => c.googleId === service.googleId);
      // if service doesn't exist then return true and keep the service.
      return existingService === undefined ? true : false;
    });

    claimed = claimed.filter(service => {
      let isMatch = service.price <= maxPrice;
      isMatch = service.unitsAvailable >= maxCapacity && isMatch;
      return isMatch;
    });

    this.unclaimedServices = unclaimed;
    this.claimedServices = claimed;
  }

  searchClaimedVendors(ids: string[]): Observable<VendorServices[]> {
    const services = new Subject<VendorServices[]>();

    const properties = {
      maxPrice: this.searchForm.controls['price'].value || 999999,
      maxCapacity: this.searchForm.controls['capacity'].value || 0,
      type: this.searchForm.controls['category'].value,
      googleIds: ids,
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
          radius: 15000,
          type: this.getCategory()
        };

        if (!location || !this.map) {
          return;
        }

        this.googlePlacesService.locationSearch(request, this.map).subscribe(results => {
          const vendorServices: VendorServices[] = results.map(loc => {
            return {
              price: 0,
              vendorId: 0,
              googleId: loc.place_id,
              serviceType: loc.types.toString(),
              serviceName: loc.name,
              serviceDescription: loc.vicinity,
            };
          });
          services.next(vendorServices);
        });
      });

      return services;
  }

  onClaimClicked(service: VendorServices) {
    const type = this.searchForm.controls['category'].value;
    this.router.navigate(['claim-vendor/' + type + '/' + service.googleId]);
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

  toggleFavorite(id: any) {
    if (this.userFavorites.has(id)) {
      this.userFavorites.delete(id);
      this.favoriteServicesService.deleteFavoriteVendor({
        userName: this.userName,
        vendorId: id
      }).subscribe(() => {
        this.getFavorites();
        this.updateFavoritesTab();
      });
    } else {
      this.favoriteServicesService.addNewFavoriteVendor({
        userName: this.userName,
        vendorId: id
      }).subscribe(() => {
        this.getFavorites();
        this.updateFavoritesTab();
      });
    }
  }

  isFavorite(id: any) {
    return this.userFavorites.has(id);
  }

  updateFavoritesTab() {
    if (this.refresh) {
      this.refresh = false;
    } else {
      this.refresh = true;
    }
  }
}
