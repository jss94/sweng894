import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  isVendor = false;
  isOrganizer = false;

  constructor (
    public auth: AuthService,
    ) { }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user && user.role.toUpperCase() === 'ADMIN') {
        this.isOrganizer = true;
        this.isVendor = true;
      }

      if (user && user.role === 'VENDOR') {
        this.isOrganizer = false;
        this.isVendor = true;
      }

      if (user && user.role === 'ORGANIZER') {
        this.isOrganizer = true;
        this.isVendor = false;
      }
    });
  }
}
