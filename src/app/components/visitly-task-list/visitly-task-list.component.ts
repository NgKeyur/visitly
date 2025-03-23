import { Component } from '@angular/core';
import { convertToApiTask, convertToLocalTask, Task } from '../../model/models/task.interface';
import { TaskService } from '../../service/task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../service/notification/notification.service';
import { StatusMessages } from '../../enum/status-messages.enum';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { VisitlyHeaderComponent } from '../visitly-header/visitly-header.component';


@Component({
  selector: 'app-visitly-task-list',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
    DragDropModule,
    RouterModule,
    MatIconModule,
    VisitlyHeaderComponent],
  templateUrl: './visitly-task-list.component.html',
  styleUrl: './visitly-task-list.component.scss',
  animations: [
    trigger('taskAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class VisitlyTaskListComponent {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchQuery = '';
  sortBy = '';
  statuses = ['Pending', 'In Progress', 'Completed'] as const;
  filterStatus: string = '';

  
  constructor(private taskService: TaskService, 
    private router: Router,
  private notification : NotificationService) {}

  ngOnInit(): void {
    this.loadTasks();

    this.taskService.taskAdded$.subscribe((newTask) => {
      if (newTask) {
        this.tasks.unshift(newTask);
        this.filteredTasks = [...this.tasks];
        this.applyFilters();
      }
    });
  }

  getTasksByStatus(status: string): Task[] {
    const validStatus = status as 'Pending' | 'In Progress' | 'Completed';
    return this.filteredTasks.filter(task => task.status === validStatus);
  }
  
  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => convertToLocalTask(task));
      console.log("task", this.tasks);
      this.filteredTasks = [...this.tasks];
      this.applyFilters();
    });
  }
  

  searchTasks(): void {
    this.applyFilters();
  }

  sortTasks(): void {
    if (this.sortBy === 'dueDate') {
      this.filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearchQuery = task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.filterStatus ? task.status === this.filterStatus : true;
      return matchesSearchQuery && matchesStatus;
    });
  
    this.sortTasks();
  }
  

  
  editTask(task: Task): void {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.applyFilters();
    });
  }

  navigateToAddTask(): void {
    this.router.navigate(['/tasks/addTasks/']);
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string): void { 
    const task = event.item.data as Task;
  
    if (task.status === 'Completed') {
     this.notification.showError(StatusMessages.TaskCompleted)
      return;
    }

    if (event.previousContainer.id === event.container.id) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      if (task) {
        task.status = newStatus as 'Pending' | 'In Progress' | 'Completed';
        
        const apiTask = convertToApiTask(task);  
  
        this.taskService.updateTask(apiTask).subscribe({
          next: (updatedTask) => {
            const index = this.tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) this.tasks[index] = convertToLocalTask(updatedTask);
            this.applyFilters();
          },
          error: (error) => console.error('Error updating task:', error)
        });
      }
    }
  }
  
  markAsCompleted(task: Task) {
    this.taskService.markTaskAsCompleted(task).subscribe(updatedTask => {
      task.status = updatedTask.status;
      this.filterTasks();
    });
  }

  filterTasks() {
    this.filteredTasks = this.filterStatus ? 
      this.tasks.filter(task => task.status === this.filterStatus) : 
      this.tasks;
  }

  clearSearchQuery(): void {
    this.searchQuery = '';
    this.applyFilters();
  }
  
  clearFilterStatus(): void {
    this.filterStatus = '';
    this.applyFilters();
  }

  clearSortBy() {
    this.sortBy = '';
    this.sortTasks();
  }
}
