import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitlyTaskFormComponent } from './visitly-task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../service/task/task.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';

describe('VisitlyTaskFormComponent', () => {
  let component: VisitlyTaskFormComponent;
  let fixture: ComponentFixture<VisitlyTaskFormComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTask', 'createTask', 'updateTask']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    let authServiceMock: jasmine.SpyObj<AuthService>;
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    


    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '123' 
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitlyTaskFormComponent);
    component = fixture.componentInstance;

    taskServiceMock.getTask.and.returnValue(of(undefined)); 

    fixture.detectChanges();  
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize taskId from route', () => {
    component.ngOnInit();
    expect(component.taskId).toBe(123); 
  });

  it('should initialize form with default values', () => {
    expect(component.taskForm).toBeTruthy();
    expect(component.taskForm.controls['id'].value).toBe(0); 
    expect(component.taskForm.controls['status'].value).toBe('Pending');
    expect(component.taskForm.controls['title'].value).toBe(''); 
    expect(component.taskForm.controls['dueDate'].value).toBe(''); 
  });


  it('should be invalid when required fields are not filled in', () => {
    const titleControl = component.taskForm.controls['title'];
    const dueDateControl = component.taskForm.controls['dueDate'];
    expect(component.taskForm.invalid).toBeTrue();

    titleControl.setValue('visitly');
    dueDateControl.setValue('2025-03-30');

    expect(component.taskForm.valid).toBeTrue();
  });

});
