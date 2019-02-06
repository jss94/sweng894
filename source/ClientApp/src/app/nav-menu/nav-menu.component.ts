import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  isVendor = false;
  isOrginizor = false;

  constructor (private auth: AuthService) {

    auth.user$.subscribe((user) => {
      if (user.role.toUpperCase() === 'ADMIN') {
        this.isVendor = true;
        this.isOrginizor = true;
      }

      if (user.role === 'VENDOR') {
        this.isVendor = true;
      }
    });
  }
}
