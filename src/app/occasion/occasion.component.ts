import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { MatDialog } from '@angular/material/dialog';
interface Occasion {
  id?: number | string;
  occasion_name: string;
  occasion_date: string;
  userId?: number | string;
}

@Component({
  selector: 'app-occasion',
  templateUrl: './occasion.component.html',
  styleUrls: ['./occasion.component.css'],
})
export class OccasionComponent implements OnInit {
  occasions: Occasion[] = [];
  occasionForm: FormGroup;
  selectedOccasion: Occasion | null = null;
  occasionlist: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['occasion_name', 'occasion_date', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Notification properties
  showNotification: boolean = false;
  notificationType: string = '';
  notificationMessage: string = '';

  constructor(
    private service: ApiService,
    private builder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.occasionForm = this.builder.group({
      occasion_name: ['', Validators.required],
      occasion_date: ['', Validators.required],
    });
    this.loadOccasion();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadOccasion() {
    const userId = sessionStorage.getItem('userId') ?? '';
    this.service.getAllOccasions(userId).subscribe((res) => {
      this.occasionlist = res;
      this.dataSource.data = this.occasionlist;
    });
  }

  getOccasions() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.service.getOccasions(userId).subscribe(
        (occasions: Occasion[]) => {
          this.occasions = occasions;
        },
        (error: any) => {
          console.log('Error retrieving occasions:', error);
        }
      );
    }
  }

  editOccasion(occasion: Occasion) {
    this.openUpdateDialog(occasion);
  }

  deleteOccasion(occasion: Occasion) {
    if (confirm('Are you sure you want to delete this occasion?')) {
      const occasionId = occasion.id?.toString();
      console.log(occasionId);
      if (occasionId) {
        this.service.deleteOccasion(occasionId!).subscribe(
          () => {
            console.log('Occasion deleted successfully');
            this.showSuccessNotification('Occasion deleted successfully');
            this.getOccasions();
          },
          (error: any) => {
            this.showErrorNotification('Error deleting occasion');
            console.log('Error deleting occasion:', error);
          }
        );
      }
    }
  }

  openUpdateDialog(occasion: Occasion) {
    const dialogRef = this.dialog.open(UpdatepopupComponent, {
      width: '400px',
      data: occasion,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any logic after the dialog is closed
      // For example, you can refresh the occasion list
      this.loadOccasion();
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
