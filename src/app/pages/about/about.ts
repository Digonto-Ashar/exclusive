import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

// 1. Import the reusable component
import { ServiceFeature } from '../../shared/components/service-feature/service-feature';

@Component({
  selector: 'app-about',
  standalone: true,
  // 2. Add the component to the imports array
  imports: [CommonModule, NgOptimizedImage, ServiceFeature],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About{

  serviceFeatures = [
    { 
      iconUrl: 'assets/icons/delivery.svg', 
      title: 'FREE AND FAST DELIVERY', 
      subtitle: 'Free delivery for all orders over $140' 
    },
    { 
      iconUrl: 'assets/icons/support.svg', 
      title: '24/7 CUSTOMER SERVICE', 
      subtitle: 'Friendly 24/7 customer support' 
    },
    { 
      iconUrl: 'assets/icons/secure.svg', 
      title: 'MONEY BACK GUARANTEE', 
      subtitle: 'We return money within 30 days' 
    }
  ];

  constructor() { }
}
