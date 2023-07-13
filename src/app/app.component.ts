import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck {
  title = 'OccasionDateReminder';
  isMenuVisible: boolean = true;

  constructor(private router: Router) {}

  ngDoCheck(): void {
    this.isMenuVisible = this.checkMenuVisibility();
  }

  checkMenuVisibility(): boolean {
    const currentRoute = this.router.url;
    const role = sessionStorage.getItem('role');

    if (currentRoute === '/login' || currentRoute === '/signup') {
      return false;
    } else if (role === 'admin' || role === 'user') {
      return true;
    } else {
      return false;
    }
  }

  isUserAdmin(): boolean {
    const role = sessionStorage.getItem('role');
    return role === 'admin';
  }
  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('username') !== null;
  }
}
