import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';


@Injectable()
export class MockGooglePlacesService {
    locationSearch(request, map) {}

    getVendorById(id: string, map: google.maps.Map): Observable<any> {
        return of(undefined);
    }

    removeMarkers() {}

    getAddressFromGeolocation(location: {lat: number, lng: number}) {
        return of(undefined);
    }

    getGeoLocationFromAddress(address: string) {
        return of(undefined);
    }
}

