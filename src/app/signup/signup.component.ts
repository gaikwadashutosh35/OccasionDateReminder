import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(
    private service: ApiService,
    private builder: FormBuilder,
    private router: Router
  ) // private toastr: ToastrService
  {}

  signupForm = this.builder.group({
    first_name: this.builder.control('', [
      Validators.required,
      this.nameValidator(),
    ]),
    last_name: this.builder.control('', [
      Validators.required,
      this.nameValidator(),
    ]),
    username: this.builder.control('', [
      Validators.required,
      this.usernameValidator(),
    ]),
    email: this.builder.control('', [Validators.required, Validators.email]),
    mobile: this.builder.control('', [
      Validators.required,
      this.mobileValidator(),
    ]),
    gender: this.builder.control('male'),
    password: this.builder.control('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]),
    role: this.builder.control(''),
    is_active: this.builder.control(false),
  });

  proceedSignup() {
    if (this.signupForm.valid) {
      this.service.signup(this.signupForm.value).subscribe(
        (result) => {
          console.log(result);
          const userId = result.userId;
          sessionStorage.setItem('userId', userId.toString());
          // this.toastr.success('Registered successfully');
          this.router.navigate(['login']);
        },
        (error) => {
          console.error('Error during signup:', error);
          // this.toastr.error('Signup failed');
        }
      );
    } else {
      console.log('Please enter valid data');
      // this.toastr.warning('Please enter valid data');
    }
  }

  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const nameRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>/?]+$/;
      const isValid = nameRegex.test(control.value);
      return isValid ? null : { invalidName: true };
    };
  }
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const nameRegex = /^[A-Za-z]+$/;
      const isValid = nameRegex.test(control.value);
      return isValid ? null : { invalidName: true };
    };
  }

  mobileValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const mobileRegex = /^[0-9]{10}$/;
      const isValid = mobileRegex.test(control.value);
      return isValid ? null : { invalidMobile: true };
    };
  }
}
