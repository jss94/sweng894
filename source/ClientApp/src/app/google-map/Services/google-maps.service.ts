/// <reference types="@types/googlemaps" />

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleMapsService {
    constructor() {
    }

    setMap(element: HTMLElement, properties: {zoom: number, center: any}): any {
        return new google.maps.Map(element, properties);
    }

    setMarker(position: any, map: any ): any {
        return new google.maps.Marker({position, map});
    }
}
