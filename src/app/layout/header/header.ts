import { Component, OnInit } from '@angular/core'; // <-- 1. IMPORT OnInit
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';
import { WishlistService } from '../../core/services/wishlist'; // Corrected import path
import { CartService } from '../../core/services/cart.service';     // <-- 2. IMPORT CartService

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit { // <-- 3. IMPLEMENT OnInit
  // Wishlist properties (already exist)
  public wishlistCount: number = 0;
  public wishlistCountDisplay: string = '0';

  // --- 4. ADD NEW PROPERTY FOR THE CART COUNT ---
  public cartItemCount: number = 0;
  public cartCountDisplay: string = '0';

  public isMenuOpen = false;

  // --- 5. INJECT CartService IN THE CONSTRUCTOR ---
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

    toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  ngOnInit(): void {
    // This is your existing wishlist logic
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistCount = items.length;
      if (this.wishlistCount > 9) {
        this.wishlistCountDisplay = '9+';
      } else {
        this.wishlistCountDisplay = this.wishlistCount.toString();
      }
    });

    // --- 6. ADD NEW SUBSCRIPTION FOR THE CART ---
    this.cartService.cartItems$.subscribe(items => {
      // We sum the quantity of each item to get the total count
      this.cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
         if (this.cartItemCount > 9) {
        this.cartCountDisplay = '9+';
      } else {
        this.cartCountDisplay = this.cartItemCount.toString();
      }
   
    });
  }
}
