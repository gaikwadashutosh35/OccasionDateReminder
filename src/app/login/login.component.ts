import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  // Notification properties
  showNotification: boolean = false;
  notificationType: string = '';
  notificationMessage: string = '';

  constructor(
    private service: ApiService,
    private builder: FormBuilder,
    private router: Router
  ) {
    sessionStorage.clear();
  }
  result: any;

  loginForm = this.builder.group({
    username: this.builder.control('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]+$/),
    ]),
    password: this.builder.control('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  

  proceedlogin() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    if (username === null || username === undefined) {
      this.showErrorNotification('Please enter a valid username');
      console.log('Please enter a valid username');
      return;
    }

    if (password === null || password === undefined) {
      console.log('Please enter a valid password');
      this.showErrorNotification('Please enter a valid password');
      return;
    }

    this.service.login(username).subscribe(
      (response: any) => {
        this.result = response;
        const userId = this.result.userId;
        if (userId) {
          sessionStorage.setItem('username', this.result.username);
          sessionStorage.setItem('role', this.result.role);
          console.log(this.result.role);
          sessionStorage.setItem('userId', userId.toString());
          this.showSuccessNotification('Login Successfully');
          setTimeout(() => {
            if (this.result.role === 'admin') {
              this.router.navigate(['/users']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 1500);
        } else {
          this.showErrorNotification(
            'Invalid username or password. Please type valid username and password'
          );
          console.log('Please enter the correct details');
        }
      },
      (error: any) => {
        console.error('Error during login:', error);
        this.showErrorNotification('Login failed');
      }
    );
  }

  showSuccessNotification(message: string) {
    this.showNotification = true;
    this.notificationType = 'success';
    this.notificationMessage = message;
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  showErrorNotification(message: string) {
    this.showNotification = true;
    this.notificationType = 'error';
    this.notificationMessage = message;
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  showWarningNotification(message: string) {
    this.showNotification = true;
    this.notificationType = 'warning';
    this.notificationMessage = message;
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  hideNotification() {
    this.showNotification = false;
    this.notificationType = '';
    this.notificationMessage = '';
  }
}
