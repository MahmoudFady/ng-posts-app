import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.sass', './signup.component.sass'],
})
export class SignupComponent implements OnInit {
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
        console.log(this.isLoading);
      });
    this.subscriptions[this.subscriptions.length] = this.authService
      .getErorrMessage()
      .subscribe((err) => {
        this.errMessage = err;
        console.log(this.errMessage);
      });
  }
  signup(form: NgForm) {
    this.isLoading = true;
    const { email, password } = form.value;
    this.authService.signup(email, password);
    form.reset();
  }
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
