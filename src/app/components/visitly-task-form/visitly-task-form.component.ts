import { Component, EventEmitter, Input, Output } from '@angular/core';
import { convertToApiTask, convertToLocalTask, Task } from '../../model/models/task.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../service/task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusMessages } from '../../enum/status-messages.enum';
import { NotificationService } from '../../service/notification/notification.service';
import { VisitlyHeaderComponent } from '../visitly-header/visitly-header.component';

@Component({
  selector: 'app-visitly-task-form',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule,
    VisitlyHeaderComponent
  ],
  templateUrl: './visitly-task-form.component.html',
  styleUrl: './visitly-task-form.component.scss'
})
export class VisitlyTaskFormComponent {

  taskForm!: FormGroup;
  statusOptions = ['Pending', 'In Progress', 'Completed'];
  taskId: number = 0;
  minDate = new Date().toISOString().split('T')[0];


  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeTaskForm();

    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.taskId) {
      this.loadTask();
    }
  }

  initializeTaskForm(){
    this.taskForm = this.fb.group({
      id: [0],
      userId: [null],
      title: ['', Validators.required],
      description: [''],
      status: ['Pending'],
      dueDate: ['', Validators.required],
      completed: [false]
    });
  }

  loadTask(): void {
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
  
        if (task) {
          const localTask = convertToLocalTask(task);
          
          if (localTask.dueDate) {
            localTask.dueDate = new Date(localTask.dueDate).toISOString().split('T')[0];
          }
          
          this.taskForm.patchValue(localTask);
        }
      },
      error: (error) => console.error('Error fetching task:', error)
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.notificationService.showError(StatusMessages.RequireFormFields)
      return;
    }

    const taskData: Task = this.taskForm.value;

    if (taskData.id === 0) { 
      const apiTask = convertToApiTask(taskData);  

      this.taskService.createTask(apiTask).subscribe((createdTask) => {
        this.router.navigate(['/tasks']);
      });
    } else { 
      const apiTask = convertToApiTask(taskData); 
      this.taskService.updateTask(apiTask).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

}
