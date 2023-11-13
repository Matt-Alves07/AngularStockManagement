import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { AuthRequest } from 'src/app/Models/Interfaces/user/AuthRequest';
import { SignupUserRequest } from 'src/app/Models/Interfaces/user/SignupUserRequest';
import { Router } from '@angular/router';

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
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
  ) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.valid && this.loginForm.value) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set("token", response?.token, 1);
              this.loginForm.reset;

              this.router.navigate(['/dashboard']);

              this.messageService.add({
                severity: 'success',
                summary: 'Successful Login!',
                detail: `Welcome ${response?.name}`,
                life: 5000
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Occurred!',
              detail: 'Something went wrong when trying to login',
              life: 10000
            })
          },
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
              this.signUpForm.reset;
              this.loginCard = true;

              this.messageService.add({
                severity: 'success',
                summary: 'User created successfully!',
                detail: `Welcome ${response?.name}`,
                life: 5000
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Occurred!',
              detail: 'Something went wrong when trying to create an account',
              life: 10000
            })
          },
        });
    }
  }
}
