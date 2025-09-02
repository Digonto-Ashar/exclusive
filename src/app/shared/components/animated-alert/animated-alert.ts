import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { NotificationService, Alert } from '../../../core/services/notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animated-alert.html',
  styleUrls: ['./animated-alert.scss'],
  
  animations: [
    trigger('alertState', [
      // The 'slide' animation (unchanged)
      transition('void => slide', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition('slide => void', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ]),

      // Entry for 'fade': Fades in from invisible.
      transition('void => fade', [
        style({ opacity: 0 }),
        animate('350ms ease-in-out', style({ opacity: 1 }))
      ]),

      // Exit for 'fade': Fades out to invisible.
      transition('fade => void', [
        animate('350ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AnimatedAlert implements OnInit {
  alert: Alert | null = null;
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.notificationService.alert$.subscribe(alert => {
      this.alert = alert;
      if (alert) { setTimeout(() => this.close(), alert.duration); }
    });
  }
  close(): void {
    this.notificationService.hide();
  }
}
