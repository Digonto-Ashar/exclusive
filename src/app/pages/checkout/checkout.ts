import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderSummary } from '../../shared/components/order-summary/order-summary'; // Import the component
import { CartService } from '../../core/services/cart.service'; // Import your cart service
import { CartItem } from '../../core/interfaces/cart-item.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification';


@Component({
  selector: 'app-checkout',
  imports: [ CommonModule, ReactiveFormsModule, OrderSummary],
templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Checkout implements OnInit {
  billingForm!: FormGroup;
  
  // --- CART DATA OBSERVABLES ---
  cartItems$!: Observable<CartItem[]>;
  subtotal$!: Observable<number>;
  shippingCost: number = 0; // Or calculate based on logic
  total$!: Observable<number>;

  public isPlacingOrder: boolean = false;
  public isApplyingCoupon: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private cdr: ChangeDetectorRef, // Inject the cart service
    private notificationService: NotificationService
    
  ) {}

  ngOnInit(): void {
    // --- 1. INITIALIZE THE BILLING FORM (as before) ---
    this.billingForm = this.fb.group({
      firstName: ['', Validators.required],
      companyName: [''],
      streetAddress: ['', Validators.required],
      apartment: [''],
      townCity: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      saveInfo: [false]
    });

    // --- 2. GET LIVE DATA FROM THE CART SERVICE ---
    // Get the stream of cart items
    this.cartItems$ = this.cartService.cartItems$;

    // Create a new stream for the subtotal that calculates whenever the cart changes
    this.subtotal$ = this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
    );

    // Create a new stream for the final total
    this.total$ = this.subtotal$.pipe(
      map(subtotal => subtotal + this.shippingCost)
    );
  }

  // --- METHOD TO PLACE THE ORDER ---
    placeOrder(): void {
    if (this.billingForm.invalid) {
      // Show an error notification if the form is invalid
      // We now pass the type as a simple string
      this.notificationService.show('Please fill out all required fields.', 'error');
      
      Object.values(this.billingForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isPlacingOrder = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isPlacingOrder = false;
      this.cdr.detectChanges();
      
      // --- SHOW SUCCESS NOTIFICATION (Corrected Call) ---
      this.notificationService.show('Your order has been placed successfully!', 'success');

    }, 1000);
  }



  // --- METHODS TO HANDLE EVENTS FROM THE SUMMARY COMPONENT ---
  handlePlaceOrder(): void {
    this.placeOrder();
    if (this.billingForm.valid) {
      console.log('Order placed!', {
        billingDetails: this.billingForm.value,
        // You can get cart data here too before sending to backend
      });
    } else {
      console.log('Billing form is invalid.');
    }
  }

  handleApplyCoupon(couponCode: string): void {
    if (!couponCode) {
      // Show an info notification if the input is empty
      // We now pass the type as a simple string
      this.notificationService.show('Please enter a coupon code.', 'error');
      return;
    }

    this.isApplyingCoupon = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isApplyingCoupon = false;
      this.cdr.detectChanges();

      console.log('Coupon applied:' , couponCode);

      // --- SHOW SUCCESS NOTIFICATION (Corrected Call) ---
      this.notificationService.show('Coupon applied successfully!', 'success');

    }, 500);
  }
  

}
