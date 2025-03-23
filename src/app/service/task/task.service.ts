import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Task } from '../../model/models/task.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification/notification.service';
import { StatusMessages } from '../../enum/status-messages.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
 
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private localTasksKey = btoa('localTasks');
  private taskAddedSubject = new BehaviorSubject<Task | null>(null);
  taskAdded$ = this.taskAddedSubject.asObservable();
  private cachedApiTasks: Task[] = []; 


  constructor(private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  markTaskAsCompleted(task: Task): Observable<Task> {
    task.status = 'Completed';
    return this.updateTask(task).pipe(
      tap(() => this.notificationService.showSuccess(StatusMessages.MarkTaskAsCompleted))
    );
  }

  //  Get task
  getTasks(): Observable<Task[]> {
    return new Observable(observer => {
      this.http.get<Task[]>(this.apiUrl).subscribe(apiTasks => {
        const localTasks = this.getLocalTasks();
  
        // Filter out the tasks that are marked as localOnly
        const filteredApiTasks = apiTasks.filter(apiTask => 
          !localTasks.some(localTask => localTask.id === apiTask.id && localTask.localOnly)
        );
  
        // Combine local tasks with filtered API tasks
        const combinedTasks = [...localTasks, ...filteredApiTasks];
        
        observer.next(combinedTasks);
        observer.complete();
      });
    });
  }

  //  Update task
  getTask(id: number): Observable<Task | undefined> {
    if (id > 0) {
      // Check if the task exists in localTasks with localOnly
      const localTasks = this.getLocalTasks();
      const localOverrideTask = localTasks.find(task => task.id === id && task.localOnly);

      if (localOverrideTask) {
        return of(localOverrideTask); 
      }

      // Attempt to find the task in the cached API tasks
      const apiTask = this.cachedApiTasks.find(task => task.id === id);
      if (apiTask) {
        return of(apiTask);  // Return the cached task if found
      }

      // Fetch the task from the live API if not found in the cache
      return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
        tap(task => {
          if (task) this.cachedApiTasks.push(task);  // Cache the fetched task
        })
      );
    } else {
      const localTasks = this.getLocalTasks();
      const task = localTasks.find(task => task.id === id);
      return of(task); // Return the local task if found.
    }
  }

  //  Create a task
  createTask(task: Task): Observable<Task> {
    // Retrieve existing tasks from localStorage
    const localTasks = this.getLocalTasks();
    
    // Generate a unique negative ID for the new task (local-only task)
    task.id = this.generateUniqueLocalId(localTasks);
    
    // Mark the task as a local-only task
    task.localOnly = true;
    localTasks.push(task);
    
    // Save updated tasks list back to localStorage
    localStorage.setItem(this.localTasksKey, btoa(JSON.stringify(localTasks)));

    this.taskAddedSubject.next(task); 
     // Return the newly created task as an Observable with a success notification
    return of(task).pipe(
      tap(() => this.notificationService.showSuccess(StatusMessages.TaskCreatedSuccessfully))
    );
  }


  // Update task
  updateTask(updatedTask: Task): Observable<Task> {
    let localTasks = this.getLocalTasks();
  
    // Remove the existing task with the same ID from localTasks if it exists
    localTasks = localTasks.filter(task => task.id !== updatedTask.id);
  
    if (updatedTask.id > 0) { 
      // If it's a live task, store the updated task with the same ID and mark it as local update
      const newTaskForLocal = { ...updatedTask, localOnly: true };
      localTasks.push(newTaskForLocal);
    } else { 
      // It's a new local task being added
      updatedTask.localOnly = true;  
      localTasks.push(updatedTask);
      this.notificationService.showSuccess(StatusMessages.NewTaskAddedSuccessfully);
    }
    
    // Save filtered tasks to localStorage
    localStorage.setItem(this.localTasksKey, btoa(JSON.stringify(localTasks))); 
  
    if (updatedTask.id > 0) {
      // If it's a live task, update the live data
      return this.http.put<Task>(`${this.apiUrl}/${updatedTask.id}`, updatedTask).pipe(
        tap(() => this.notificationService.showSuccess(StatusMessages.TaskUpdatedSuccessfully))
      );
    }
  
    return of(updatedTask);
  }
  

  
  // updateTask(updatedTask: Task): Observable<Task> {
  //   debugger;
  //   let localTasks = this.getLocalTasks();
  //   const index = localTasks.findIndex(task => task.id === updatedTask.id);
  
  //   if (index !== -1) {
  //     localTasks[index] = updatedTask;
  //     this.notificationService.showSuccess(StatusMessages.TaskUpdatedSuccessfully);
  //   } 
  //   else if (updatedTask.id > 0) { 
  //     const newTaskForLocal = { ...updatedTask, id: this.generateUniqueLocalId(localTasks) };
  //     localTasks.push(newTaskForLocal);
  //   } 
  //   else { 
  //     localTasks.push(updatedTask);
  //     this.notificationService.showSuccess(StatusMessages.NewTaskAddedSuccessfully);
  //   }
  //   const uniqueTasks = Array.from(new Map(localTasks.map(task => [task.id, task])).values());

  //   localStorage.setItem(this.localTasksKey, btoa(JSON.stringify(localTasks))); 
    
  //   if (updatedTask.id > 0) {
  //     return this.http.put<Task>(`${this.apiUrl}/${updatedTask.id}`, updatedTask).pipe(
  //       tap(() => this.notificationService.showSuccess(StatusMessages.TaskUpdatedSuccessfully))
  //     );
  //   }
  
  //   return of(updatedTask);
  // }
  

  
  deleteTask(id: number): Observable<void> {
    let localTasks = this.getLocalTasks();
    localTasks = localTasks.filter(task => task.id !== id);
    if (localTasks.length === 0) {
      localStorage.removeItem(this.localTasksKey);
    } else {
      localStorage.setItem(this.localTasksKey, btoa(JSON.stringify(localTasks)));
    }  
    return of(void 0).pipe(
      tap(() => this.notificationService.showError(StatusMessages.TaskDeletedSuccessfully))
    );
  }
  
  private getLocalTasks(): Task[] {
    const savedTasks = localStorage.getItem(this.localTasksKey);
    return savedTasks ? JSON.parse(atob(savedTasks)) : [];
  }

  private generateUniqueLocalId(tasks: Task[]): number {
    const minId = Math.min(...tasks.map(t => t.id), 0);
    return minId - 1;
  }

}
