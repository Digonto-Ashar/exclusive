import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class Welcome {
  
  // Inject the authentication service
  private authService = inject(AuthService);

  // Create an observable to hold the user's name
  public userName$: Observable<string>;

  constructor() {
    // Get the current user observable from the service
    this.userName$ = this.authService.currentUser$.pipe(
      // Use the map operator to extract the name, or provide a default
      map(user => user ? user.name : 'Guest')
    );
  }
}
