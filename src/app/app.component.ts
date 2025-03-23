import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  title = 'visitly';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkAuthentication(); 
  }
}
