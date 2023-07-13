import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Occasion {
  id?: number | string;
  occasion_name: string;
  occasion_date: string;
  userId?: number | string;
}

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css'],
})
export class UpdatepopupComponent {
  occasionForm: FormGroup;
  id?:string;
  constructor(
    private builder: FormBuilder,
    private service: ApiService,
    private formBuilder: FormBuilder,

    public dialogref: MatDialogRef<UpdatepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public occasion: Occasion
  ) {
    this.occasionForm = this.builder.group({
      occasion_name: [occasion.occasion_name, Validators.required],
      occasion_date: [occasion.occasion_date, Validators.required]
    });
  }

  editdata: any;
  occasionlist: any;

  // Notification properties
  showNotification: boolean = false;
  notificationType: string = '';
  notificationMessage: string = '';


  updateOccasion() {
    const updatedOccasion = this.occasionForm.value;
    console.log(updatedOccasion);
    if (this.occasionForm.valid && this.data.id) {
      const updatedOccasion: Occasion = {
        id: this.data.id,
        occasion_name: this.occasionForm.value.occasion_name,
        occasion_date: this.occasionForm.value.occasion_date,
        userId: this.data.userId
      };

      this.service.updateOccasion(this.data.id.toString(), updatedOccasion).subscribe(
        () => {
          console.log(updatedOccasion);
          console.log('Occasion updated successfully');
          this.dialogref.close(updatedOccasion);
        },
        (error: any) => {
          console.log('Error updating occasion:', error);
        }
      );
    }
  }

  cancel() {
    this.dialogref.close();
  }

  showSuccessNotification(message: string) {
    this.showNotification = true;
    this.notificationType = 'success';
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
