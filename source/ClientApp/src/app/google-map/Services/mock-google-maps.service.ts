/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';

@Injectable()
export class MockGoogleMapsService {
    constructor() {
    }

    setMap(element: HTMLElement, properties: {zoom: number, center: any}): any {
        return null;
    }

    setMarker(position: any, map: any ): any {
        return null;
    }
}
