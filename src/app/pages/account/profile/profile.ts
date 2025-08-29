import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification'; // Adjust path if needed

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService // Inject your notification service
  ) {}

  ngOnInit(): void {
    // --- Create the form structure ---
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      // Password fields are optional for profile updates
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });

    // --- Load user data and patch the form ---
    // In a real app, you would get this data from an AuthService
    this.loadUserData();
  }

  loadUserData(): void {
    // Simulate fetching user data from a service
    const userData = {
      firstName: 'Ashar',
      lastName: 'Rahman',
      email: 'ashar1111@gmail.com',
      address: 'Kingston, 5236, United State'
    };
    // Use patchValue to fill in the form fields
    this.profileForm.patchValue(userData);
  }

  saveChanges(): void {
    if (this.profileForm.invalid) {
      this.notificationService.show('Please correct the errors before saving.', 'error');
      return;
    }

    // In a real app, you would send this data to your backend API
    console.log('Saving profile data:', this.profileForm.value);

    // Simulate a successful save
    this.notificationService.show('Profile updated successfully!', 'success');
    
    // You might want to reset the password fields after saving
    this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
  }

  cancelChanges(): void {
    // Reload the original user data to discard any changes
    this.loadUserData();
    this.notificationService.show('Changes have been canceled.', 'info');
  }
}
