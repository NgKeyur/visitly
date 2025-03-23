import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VisitlyTaskListComponent } from './components/visitly-task-list/visitly-task-list.component';
import { authGuard } from './service/guard/auth.guard';
import { VisitlyTaskFormComponent } from './components/visitly-task-form/visitly-task-form.component';
import { adminGuard } from './service/guard/admin.guard';

export const routes: Routes = [ 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: VisitlyTaskListComponent, canActivate: [authGuard] },
  { path: 'tasks/addTasks', component: VisitlyTaskFormComponent, canActivate: [authGuard,adminGuard] },
  { path: 'tasks/edit/:id', component: VisitlyTaskFormComponent, canActivate: [authGuard,adminGuard] } ,
  { path: '**', redirectTo: '/tasks' }
];
