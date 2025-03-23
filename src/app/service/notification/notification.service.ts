import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 3000, 
      panelClass: ['mat-toolbar', 'mat-primary'] 
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 3000, 
      panelClass: ['mat-toolbar', 'mat-warn'] 
    });
  }

}
