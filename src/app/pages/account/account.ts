import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Import the Router
import { Router, RouterModule } from '@angular/router';

// 2. Import your AuthService
import { AuthService } from '../../core/services/auth';
import { Welcome } from './welcome/welcome';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Welcome
  ],
  templateUrl: './account.html',
  styleUrls: ['./account.scss']
})
export class Account {
  
  // 3. Inject both AuthService and Router
  private authService = inject(AuthService);
  private router = inject(Router);

  // The constructor is now empty
  constructor() {}

  // 4. Create the onLogout method
  onLogout(): void {
    // Call the logout method from your authentication service
    this.authService.logout();

    // Navigate the user back to the login page
    this.router.navigate(['/login']);
  }
}
