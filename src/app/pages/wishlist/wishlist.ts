import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

// --- CORE SERVICE AND INTERFACE IMPORTS ---
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist';
import { Product } from '../../core/interfaces/product.interface';
import { NotificationService } from '../../core/services/notification';
import { ProductService } from '../../core/services/product.service'; // Added for recommendations

// --- SHARED COMPONENT IMPORTS ---
import { ProductCard } from '../../shared/components/product-card/product-card';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { SkeletonProductCard } from '../../shared/components/skeleton-product-card/skeleton-product-card';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCard,
    SkeletonProductCard 
  ],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class Wishlist implements OnInit { 

  // --- REFERENCES TO HTML ELEMENTS ---
  @ViewChild('justForYouSection') justForYouSection!: ElementRef<HTMLDivElement>;

  // --- INJECT SERVICES ---
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);
  private productService = inject(ProductService);

  // --- WISHLIST PROPERTIES ---
  wishlistItems$: Observable<Product[]> = this.wishlistService.wishlistItems$;
  wishlistCount$: Observable<number> = this.wishlistItems$.pipe(map(items => items.length));

  // --- "JUST FOR YOU" SECTION PROPERTIES (RESTORED) ---
  justForYouProducts: Product[] = [];
  public _allJustForYouProducts: Product[] = [];
  public isJustForYouExpanded: boolean = false;
  isJustForYouLoading: boolean = true;
  justForYouSkeletonItems = Array(4).fill(0);

  constructor() { }

  ngOnInit(): void {
    // --- LOAD RECOMMENDATIONS WHEN THE COMPONENT INITIALIZES ---
    this.loadJustForYouProducts();
  }

  // --- WISHLIST ACTIONS ---
  onRemoveFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    this.notificationService.show('Item removed from wishlist.', 'info');
  }

  moveAllToBag(): void {
    this.wishlistItems$.pipe(take(1)).subscribe(products => {
      if (products && products.length > 0) {
        this.cartService.addItems(products);
        this.wishlistService.clearWishlist();
        this.notificationService.show('All items moved to your bag!', 'success');
      }
    });
  }

  // --- "JUST FOR YOU" METHODS (RESTORED) ---
  loadJustForYouProducts(): void {
    this.isJustForYouLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this._allJustForYouProducts = data.slice(5, 25);
        this.justForYouProducts = this._allJustForYouProducts.slice(0, 16);
        this.isJustForYouLoading = false;
      },
      error: (err) => {
        console.error('Error fetching "Just For You" products', err);
        this.isJustForYouLoading = false;
      }
    });
  }

  toggleJustForYouView(): void {
    if (this.isJustForYouExpanded) {
      this.justForYouSection.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    this.isJustForYouExpanded = !this.isJustForYouExpanded;
  }
}
