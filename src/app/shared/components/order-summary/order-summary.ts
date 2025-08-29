
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { CartItem } from '../../../core/interfaces/cart-item.interface';


@Component({
  selector: 'app-order-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummary {

    // --- INPUTS: Data coming IN from the parent component ---
  @Input() cartItems: CartItem[] = [];
  @Input() subtotal: number = 0;
  @Input() shipping: number | string = 'Free';
  @Input() total: number = 0;

  @Input() isPlacingOrder: boolean = false;
  @Input() isApplyingCoupon: boolean = false;


  // --- OUTPUTS: Events going OUT to the parent component ---
  @Output() placeOrderClick = new EventEmitter<void>();
  @Output() applyCouponClick = new EventEmitter<string>();

  // --- INTERNAL STATE ---
  paymentMethod: string = 'cod';
  couponCode: string = '';

  // --- METHODS THAT EMIT EVENTS ---
  onPlaceOrder(): void {
    // This sends a signal to the parent component.
    this.placeOrderClick.emit();
  }

  onApplyCoupon(): void {
    // This sends the coupon code string to the parent component.
    this.applyCouponClick.emit(this.couponCode);
  }

}
