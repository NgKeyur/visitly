import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { NotificationService } from '../../service/notification/notification.service';
import { StatusMessages } from '../../enum/status-messages.enum';

export interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup<LoginForm>;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.notificationService.showError(StatusMessages.RequireFormFields);
      return;
    }
  
    const { username, password } = this.loginForm.value;
    const validUsername = username ?? ''; 
    const validPassword = password ?? ''; 
  
    this.authService.login(validUsername, validPassword).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/tasks']);
        } else {
          this.notificationService.showError(StatusMessages.InvalidCredential)
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.notificationService.showError(StatusMessages.Error);
      }
    });
  }
}

