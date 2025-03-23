import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitlyHeaderComponent } from './visitly-header.component';
import { AuthService } from '../../service/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('VisitlyHeaderComponent', () => {
  let component: VisitlyHeaderComponent;
  let fixture: ComponentFixture<VisitlyHeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitlyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
