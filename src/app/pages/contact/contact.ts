import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Import the necessary modules for Reactive Forms
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact implements OnInit {

  // 3. Inject FormBuilder to help create the form
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  // 4. Declare the property for the form group
  contactForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    // 5. Initialize the form with controls and validators
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  // 6. Create the submission handler method
  onSubmit(): void {
    if (this.contactForm.valid) {
      // In a real app, you would send this data to a server
      console.log('Form Submitted!', this.contactForm.value);
      this.notificationService.show('Message sent successfully!', 'success');
      this.contactForm.reset();
    } else {
      // Mark all fields as touched to display validation errors
      this.contactForm.markAllAsTouched();
      this.notificationService.show('Please fill out all fields correctly.', 'error');
    }
  }
}
