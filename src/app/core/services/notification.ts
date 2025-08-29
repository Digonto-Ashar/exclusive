import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  message: string;
  type: 'success' | 'error' | 'info';
  animation?: 'slide' | 'fade';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private alertSubject = new Subject<Alert | null>();
  public alert$ = this.alertSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info', animation: 'slide' | 'fade' = 'slide',
          duration: number = 2000
  ): void {
    this.alertSubject.next({ message, type, animation, duration });
  }

  hide() {
    this.alertSubject.next(null);
  }
}
