import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit {
  isAuth= false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.getSavedId()
      ? true : false;
    this.authService.isAuth().subscribe((auth) => {
      this.isAuth = auth;
    });
  }
  logout() {
    this.authService.logout();
  }
}
