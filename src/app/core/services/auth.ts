import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../interfaces/user.interface'; // Make sure this path is correct

// We can keep this interface here or move it to its own file.
export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://fakestoreapi.com';
  private http = inject(HttpClient);

  // --- STATE MANAGEMENT ---
  // 1. Create a BehaviorSubject to hold the current user state.
  // We'll initialize it by checking localStorage for a saved user.
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  // 2. This is the public observable that components will subscribe to.
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  // --- API CALLS & STATE UPDATES ---

  // The login method now does two things:
  // 1. Makes the API call.
  // 2. If successful, creates a user object and updates the state.
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        // NOTE: FakeStoreAPI login doesn't return user info, just a token.
        // For a REAL app, you would decode the token or make another API call
        const mockUser: User = {
          id: 1, // Placeholder ID
          name: credentials.username, // Use the username from the login form
          email: `${credentials.username}@example.com`, // Mock email
          token: response.token
        };
        
        // Save the user to localStorage and update the BehaviorSubject
        this.saveUserToStorage(mockUser);
        this.currentUserSubject.next(mockUser);
      })
    );
  }

  signup(userInfo: any): Observable<any> {
    // Signup remains the same, as it doesn't log the user in immediately.
    return this.http.post<any>(`${this.apiUrl}/users`, userInfo);
  }

  // --- HELPER METHODS ---

  logout(): void {
    // Remove the user from localStorage
    localStorage.removeItem('currentUser');
    // Broadcast `null` to all subscribers
    this.currentUserSubject.next(null);
  }

  // A simple getter to synchronously check the current value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  }
}
