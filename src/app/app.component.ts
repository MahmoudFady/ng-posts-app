import { SocketIoService } from './shared/socket-io.service';
import { AuthService } from './auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private socketIoService: SocketIoService
  ) {}
  ngOnInit() {
    this.socketIoService.init();
    this.authService.autoAuth();
  }
}
