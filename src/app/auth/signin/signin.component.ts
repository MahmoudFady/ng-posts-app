import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass'],
})
export class SigninComponent implements OnInit {
  hide = true;
  subscriptions: Subscription[] = [];
  isLoading = false;
  errMessage: null | string = null;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.subscriptions[this.subscriptions.length] = this.authService
      .isLoading()
      .subscribe((loading) => {
        this.isLoading = loading;
      });
    this.subscriptions[this.subscriptions.length] = this.authService
      .getErorrMessage()
      .subscribe((err) => {
        this.errMessage = err;
      });
  }
  signin(form: NgForm) {
    console.log('cliked');

    this.isLoading = true;
    const { email, password } = form.value;
    this.authService.signin(email, password);
  }
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
