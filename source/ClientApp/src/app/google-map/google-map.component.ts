/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
  // The location of Penn State University
  const psu = {lat: 40.7982, lng: -77.8599};
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: psu});
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({position: psu, map: map});
}

}
