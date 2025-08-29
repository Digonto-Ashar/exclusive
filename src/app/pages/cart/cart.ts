import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/interfaces/cart-item.interface';
import { Router,RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification'; // Corrected import path

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html', // Corrected to .html
  styleUrls: ['./cart.scss']  // Corrected to .scss
})
export class Cart implements OnInit { // Corrected class name
  cartItems$!: Observable<CartItem[]>;
  cartTotals$!: Observable<{ subtotal: number; shipping: number; total: number; }>;

  constructor(
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;

    this.cartTotals$ = this.cartItems$.pipe(
      map(items => {
        const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        const shipping = 0;
        const total = subtotal + shipping;
        return { subtotal, shipping, total };
      })
    );
  }

  onQuantityChange(event: Event, item: CartItem): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

updateCart(): void {
  // We also use the 'fade' animation here
  this.notificationService.show('Cart has been updated!', 'success', 'fade');
}

  // --- NEW METHOD 1: APPLY COUPON ---
  // This method will be called by your "Apply Coupon" button.
applyCoupon(): void {
  // We now specify the 'fade' animation
  this.notificationService.show('The coupon code is invalid.', 'error', 'fade');
}

  // --- NEW METHOD 2: PROCEED TO CHECKOUT ---
  // This method navigates the user to the (future) checkout page.
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
