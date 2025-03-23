import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'https://reqres.in/api/login'; 

  constructor(private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthentication();
   }

   private tokenKey = 'jwtToken';
   private userRoleKey = 'userRole';
 
   private authenticated$ = new BehaviorSubject<boolean>(false);

   login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(this.authUrl, { email: username, password: password }).pipe(
      map(response => {
        if (response && response.token) {
          if (this.isLocalStorageAvailable()) {
            localStorage.setItem(this.tokenKey, response.token);
            const role = username.toLowerCase().includes('admin') ? 'admin' : 'admin';
            localStorage.setItem(this.userRoleKey, role);
            this.authenticated$.next(true);
          }
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  checkAuthentication(): void {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem(this.tokenKey);
      this.authenticated$.next(!!token);
    }
  }

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userRoleKey);
      this.authenticated$.next(false);
      this.router.navigate(['/login']);
    }
  }

  getUserRole(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.userRoleKey);
    } 
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  isAuthenticated(): boolean {
    return this.isLocalStorageAvailable() && !!localStorage.getItem(this.tokenKey);
  }
}
