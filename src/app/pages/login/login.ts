import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
// Import our shared components
import { Button } from '../../shared/components/button/button';
import { InputField } from '../../shared/components/input-field/input-field';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // Add all necessary imports here
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  isLoading = false;
  imageLoaded = false;
  // Define the form group property
  loginForm!: FormGroup;

  private router = inject(Router)

  // Inject FormBuilder to help create the form
  constructor(private fb: FormBuilder, private authService: AuthService,
      private notificationService: NotificationService,
      
   ) {}

  // Set up the form when the component initializes
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // The old class was 'Login', changed to 'LoginComponent' for best practice
      username: ['mor_2314', [Validators.required]],
      password: ['83r5^_', [Validators.required]]
    });
  }

   // This allows you to use 'f' in your HTML to easily access form controls
  get f() { 
    return this.loginForm.controls; 
  }

onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    console.log('User Login Info:', this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.router.navigate(['/']); 
         this.notificationService.show('Login successful!', 'success', 'slide', 4000);
         
        // We can now save the token, e.g., in localStorage
        // localStorage.setItem('auth_token', response.token);
        // And then navigate the user to the homepage
        // this.router.navigate(['/']);
        this.isLoading = false;
      },
     error: (err: any) => {
        // --- Use the new service ---
        this.notificationService.show('Login failed. Please check your credentials.', 'error', 'slide', 4000);
        this.isLoading = false;
      }
    });
  }
}