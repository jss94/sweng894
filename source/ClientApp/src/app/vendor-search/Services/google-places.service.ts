/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GoogleMapsService } from 'src/app/google-map/Services/google-maps.service';

@Injectable()
export class GooglePlacesService {

    geocoder = new google.maps.Geocoder;
    markers: google.maps.Marker[] = [];
    infowindow = new google.maps.InfoWindow();

    constructor(private mapsService: GoogleMapsService) {
    }

    locationSearch(request, map) {
        const locations = new Subject<google.maps.places.PlaceResult[]>();
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function(results) {
            locations.next(results);
        });

        locations.subscribe((places: google.maps.places.PlaceResult[]) => {
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

    removeMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });

        this.markers = [];
    }

    getAddressFromGeolocation(location: {lat: number, lng: number}) {
        const address = new Subject();
        this.geocoder.geocode({location: location}, (results, status) => {
            address.next(results[0].formatted_address);
        });

        return address;
    }

    getGeoLocationFromAddress(address: string) {
        const location = new Subject<{lat: number, lng: number}>();
        this.geocoder.geocode({address: address}, (results, status) => {
            const geo = results[0].geometry.location;
            location.next({lat: geo.lat(), lng: geo.lng()});
        });

        return location;
    }
}
