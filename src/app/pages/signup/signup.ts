import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxSkeletonLoaderModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup implements OnInit {
  isLoading = false;
  imageLoaded = false;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder,  private authService: AuthService,
    private router: Router,
   private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

const formValue = this.signupForm.value;
    const userInfo = {
      email: formValue.email,
      username: formValue.email,
      password: formValue.password,
      name: {
        firstname: formValue.name.split(' ')[0] || '',
        lastname: formValue.name.split(' ').slice(1).join(' ') || 'User'
      },
            address: {
        city: 'kilcoole',
        street: '7835 new road',
        number: 3,
        zipcode: '12926-3874',
        geolocation: {
            lat: '-37.3159',
            long: '81.1496'
        }
      },
      phone: '1-570-236-7033'
    };


    this.isLoading = true;
    console.log('User Data:', userInfo);
    this.authService.signup(userInfo).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.notificationService.show('Account created successfully! Please log in.', 'success', 'slide', 4000);
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.show('There was an error creating your account.', 'error', 'slide', 4000);
        console.error('Signup failed:', err);
        this.isLoading = false;
      }
    });
  }

  onGoogleClick() {
  console.log('Google signup clicked!');

}


}