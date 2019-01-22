/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { GoogleMapsService } from './Services/google-maps.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

  constructor(private mapService: GoogleMapsService) { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // The location of Penn State University
    const psu = {lat: 40.7982, lng: -77.8599};
    // The map, centered at Penn State University
    const map = this.mapService.setMap(document.getElementById('map'), {zoom: 7, center: psu});
    // The marker, positioned at Penn State University
    const marker = this.mapService.setMarker(psu, map);
}

}
