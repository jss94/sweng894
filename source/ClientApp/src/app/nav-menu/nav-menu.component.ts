import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  isVendor = false;
  isOrginizor = false;

  constructor (
    private auth: AuthService,
    private router: Router
    ) {

    auth.user$.subscribe((user) => {
      if (!user.role) {

      } else if (user.role.toUpperCase() === 'ADMIN') {
        this.isVendor = true;
        this.isOrginizor = true;
      }

      if (user.role === 'VENDOR') {
        this.isVendor = true;
      }
    });
  }
}
