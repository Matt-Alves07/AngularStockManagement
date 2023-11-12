import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from 'src/app/Models/Interfaces/user/AuthRequest';
import { SignupUserRequest } from 'src/app/Models/Interfaces/user/SignupUserRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  //Local variables
  loginCard: boolean = true;
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.valid && this.loginForm.value) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set("token", response?.token, 1);
              this.loginForm.reset;
            }
          },
          error: (error) => console.error(error),
        })
    }
  }

  onSigninLoginForm(): void {
    if (this.signUpForm.valid && this.signUpForm.value) {
      this.userService
        .signupUser(this.signUpForm.value as SignupUserRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              alert('User created succesfully.');
              this.signUpForm.reset;
              this.loginCard = true;
            }
          },
          error: (error) => console.error(error),
        });
    }
  }
}
