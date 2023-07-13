import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
interface Occasion {
  id?: number | string;
  occasion_name: string;
  occasion_date: string;
  // user_id?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  occasionForm: FormGroup;
  occasions: Occasion[] = [];
  selectedOccasion: Occasion | null = null;

  // Notification properties
  showNotification: boolean = false;
  notificationType: string = '';
  notificationMessage: string = '';

  constructor(
    private service: ApiService,
    private builder: FormBuilder,
    private router: Router
  ) {
    this.occasionForm = this.builder.group({
      occasion_name: ['', Validators.required],
      occasion_date: ['', Validators.required],
    });
  }

  loadOccasions() {
    const userId = sessionStorage.getItem('userId') ?? '';
    if (userId) {
      this.service.getOccasions(userId).subscribe(
        (occasions: Occasion[]) => {
          const today = new Date();
          this.occasions = occasions.filter((occasion) => {
            const occasionDate = new Date(occasion.occasion_date);
            return occasionDate >= today;
          });
        },
        (error: any) => {
          console.log('Error retrieving occasions:', error);
        }
      );
    }
  }

  addOccasion() {
    if (this.occasionForm.valid) {
      const newOccasion: Occasion = this.occasionForm.value;

      const duplicateOccasionIndex = this.occasions.findIndex(
        (occasion) =>
          occasion.occasion_name.toLowerCase() ===
            newOccasion.occasion_name.toLowerCase() &&
          occasion.occasion_date === newOccasion.occasion_date
      );

      if (duplicateOccasionIndex !== -1) {
        this.showWarningNotification('Duplicate occasion found.');
        this.occasionForm.reset();
      } else {
        const userId = sessionStorage.getItem('userId');
        console.log(userId);
        this.service.addOccasion(newOccasion, userId!).subscribe(
          (result: Occasion) => {
            console.log('Occasion added successfully:', result);
            this.showSuccessNotification('Occasion added successfully');
            this.occasionForm.reset();
          },
          (error: any) => {
            this.showErrorNotification('Error adding occasion');
            console.log('Error adding occasion:', error);
          }
        );
      }
    }
  }

  logout() {
    // Implement your logout logic here
    this.router.navigate(['/login']);
  }

  selectOccasion(occasion: Occasion) {
    this.selectedOccasion = occasion;
  }

  getOccasionItemClass(occasionName: string) {
    if (occasionName.toLowerCase().includes('birthday')) {
      return 'birthday';
    } else if (occasionName.toLowerCase().includes('anniversary')) {
      return 'anniversary';
    } else if (occasionName.toLowerCase().includes('festival')) {
      return 'festival';
    } else if (occasionName.toLowerCase().includes('special date')) {
      return 'special-date';
    } else {
      return 'others';
    }
  }

  selectTheOccasion(occasionName: string) {
    this.selectedOccasion = {
      occasion_name: occasionName,
      occasion_date: '',
    };
    this.occasionForm.patchValue({
      occasion_name: occasionName,
    });
  }

  cancelAddOccasion() {
    this.selectedOccasion = null;
  }
  getOccasionImageClass(occasionName: string) {
    if (occasionName.toLowerCase().includes('birthday')) {
      return 'birthday-image';
    } else if (occasionName.toLowerCase().includes('anniversary')) {
      return 'anniversary-image';
    } else {
      return 'other-image';
    }
  }

  getOccasionInitials(occasionName: string) {
    const words = occasionName.split(' ');
    let initials = '';
    for (const word of words) {
      if (word.length > 0) {
        initials += word[0].toUpperCase();
      }
    }
    return initials;
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
