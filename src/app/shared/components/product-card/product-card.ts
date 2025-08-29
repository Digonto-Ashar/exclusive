import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from '../../../core/interfaces/product.interface';
import { WishlistService } from '../../../core/services/wishlist';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCard implements OnInit, OnDestroy {
  
  @Input({ required: true }) product!: Product;
  @Input() showRemoveButton: boolean = false;
  @Output() remove = new EventEmitter<number>();

  public isInWishlist: boolean = false;
  private wishlistSub!: Subscription;
  
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  constructor() {}

  ngOnInit(): void {
    if (this.product) {
      this.wishlistSub = this.wishlistService.wishlistItems$.subscribe(items => {
        this.isInWishlist = items.some(item => item.id === this.product.id);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  onToggleWishlist(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }

  onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit(this.product.id);
  }
  
  // --- THIS METHOD WAS MISSING ---
  onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    this.cartService.addItems([this.product]);
    this.notificationService.show('Added to cart!', 'success');
  }

  // --- THIS HELPER METHOD WAS MISSING ---
  getStarRating(rating: number): string {
    const totalStars = 5;
    let starsHtml = '';
    for (let i = 1; i <= totalStars; i++) {
      starsHtml += (i <= rating) ? '<span class="star-filled">★</span>' : '<span class="star-empty">★</span>';
    }
    return starsHtml;
  }
}
