import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-feature',
  imports: [],
  templateUrl: './service-feature.html',
  styleUrl: './service-feature.scss'
})
export class ServiceFeature {
  @Input() iconUrl: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
