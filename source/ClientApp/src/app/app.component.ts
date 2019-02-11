import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // You can find more icons here: https://material.io/tools/icons
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private router: Router,
    ) {
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    const authResult = JSON.parse(localStorage.getItem('authResult'));
    if (authResult) {
      this.auth.renewUser(authResult);
    }
  }
}
