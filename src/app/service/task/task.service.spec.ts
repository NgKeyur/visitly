import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; 
import { TaskService } from './task.service'; 

describe('TaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
      providers: [TaskService], 
    });
  });

  it('should be created', () => {
    const service: TaskService = TestBed.inject(TaskService);
    expect(service).toBeTruthy();
  });
});
