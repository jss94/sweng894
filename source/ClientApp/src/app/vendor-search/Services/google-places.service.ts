/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GoogleMapsService } from 'src/app/google-map/Services/google-maps.service';
import { FormGroup } from '@angular/forms';

@Injectable()
export class GooglePlacesService {

    geocoder = new google.maps.Geocoder;
    markers: google.maps.Marker[] = [];
    infowindow = new google.maps.InfoWindow();
    lastSearch: FormGroup;

    constructor(private mapsService: GoogleMapsService) {
    }

    locationSearch(request, map) {
        const locations = new Subject<google.maps.places.PlaceResult[]>();
        const service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, function(results, status, pagination) {
            locations.next(results);
            console.log(pagination.nextPage())
        });

        locations.subscribe((places: google.maps.places.PlaceResult[]) => {
            if (!places) {
                return;
            }

            this.removeMarkers();

            const infowindow = this.infowindow;
            places.forEach(place => {
                const placeRequest = {
                    placeId: place.id,
                    fields: ['name', 'formatted_address', 'geometry']
                };
                service.getDetails(placeRequest, () => {
                    const marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent('<strong>' + place.name + '</strong>');
                        infowindow.open(map, this);
                    });

                    // const marker = this.mapsService.setMarker(place.geometry.location, map);
                    this.markers.push(marker);
                });

            });
        });
        return locations;
    }

    getVendorById(id: string, map: google.maps.Map): Observable<any> {
        const details = new Subject();
        const service = new google.maps.places.PlacesService(map);
        const request = {
            placeId: id,
            fields: ['name', 'formatted_address', 'geometry']
        };
        service.getDetails(request, function(place, status) {
            details.next(place);
            const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
        });

        return details;
    }

    removeMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });

        this.markers = [];
    }

    getAddressFromGeolocation(location: {lat: number, lng: number}): Observable<any> {
        const address = new Subject();
        this.geocoder.geocode({location: location}, (results, status) => {
            address.next(results[0].formatted_address);
        });

        return address;
    }

    getGeoLocationFromAddress(address: string) {
        const location = new Subject<{lat: number, lng: number}>();
        this.geocoder.geocode({address: address}, (results, status) => {
            if (results) {
                const geo = results[0].geometry.location;
                location.next({lat: geo.lat(), lng: geo.lng()});
            }
        });

        return location;
    }
}
