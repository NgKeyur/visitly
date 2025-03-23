import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TaskService } from '../../service/task/task.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-visitly-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitly-header.component.html',
  styleUrl: './visitly-header.component.scss'
})
export class VisitlyHeaderComponent {

  @Input() title!: string;
  @Input() showBackButton: boolean = false;

  constructor(private auth : AuthService){

  }
  onBack() {
    window.history.back();
  }

  onLogout(){
    this.auth.logout();
  }
}
