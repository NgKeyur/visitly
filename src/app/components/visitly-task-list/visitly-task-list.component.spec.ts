import { TestBed } from '@angular/core/testing';
import { VisitlyTaskListComponent } from './visitly-task-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from '../../service/task/task.service';
import { AuthService } from '../../service/auth/auth.service';
import { Task } from '../../model/models/task.interface';
import { of } from 'rxjs';

describe('VisitlyTaskListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitlyTaskListComponent, HttpClientTestingModule],
      providers: [AuthService,TaskService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(VisitlyTaskListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should delete a task and update the task list', () => {
    const fixture = TestBed.createComponent(VisitlyTaskListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
  
    const mockTask: Task = { 
      id: 1, 
      title: 'Test Task', 
      description: 'Test Description', 
      status: 'Pending',
      dueDate: '2025-03-30' 
    };
    
    component.tasks = [mockTask];
    component.filteredTasks = [...component.tasks];
  
    const taskService = TestBed.inject(TaskService);
    spyOn(taskService, 'deleteTask').and.returnValue(of(undefined)); 
  
    component.deleteTask(mockTask.id);
  
    expect(component.tasks.length).toBe(0);
    expect(component.filteredTasks.length).toBe(0);
    expect(taskService.deleteTask).toHaveBeenCalledWith(mockTask.id);
  });
});
