import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';

import { Product } from '../../core/interfaces/product.interface';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist';
import { NotificationService } from '../../core/services/notification';

import { ProductCard } from '../../shared/components/product-card/product-card';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { SkeletonProductDetails } from '../../shared/components/skeleton-product-details/skeleton-product-details';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCard,
    SectionHeader,
    FormsModule,
    SkeletonProductDetails
  ],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss']
})
export class ProductDetails implements OnInit, OnDestroy {

  // --- INJECT SERVICES ---
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private notificationService = inject(NotificationService);

  // --- COMPONENT STATE ---
  product$: Observable<Product> | undefined;
  relatedProducts$: Observable<Product[]> | undefined;
  
  public isInWishlist = false;
  private wishlistSub!: Subscription;
    public isLoading = true;

  quantity = 1;
  selectedSize: string | null = null;
  selectedColor: string | null = null;

  // We will manage the main image display locally
  mainImage = '';

  public isPostalInputVisible = false;
  public postalCode = '';
  public deliveryMessage = '';

  constructor() {}

  ngOnInit(): void {
    this.isLoading = true; // Start loading
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
                    // When the product loads, we also check its wishlist status
          this.wishlistSub = this.wishlistService.wishlistItems$.subscribe(items => {
            this.isInWishlist = items.some(item => item.id === +id);
          });
          return this.productService.getProductById(+id);
        }
        return []; // Or handle error appropriately
      })
    );

    // Set the main image when the product data loads
    this.product$.subscribe({
      next: (product) => {
        if (product) {
          this.mainImage = product.image;
          // --- SET isLoading TO FALSE HERE ---
          this.isLoading = false; // Data has loaded, stop loading
        }
      },
      error: (err) => {
        console.error('Failed to load product', err);
        // Also stop loading on error
        this.isLoading = false;
      }
    });

    // Fetch related products
    this.relatedProducts$ = this.productService.getProducts(4); // Get 4 related products
  }

  // --- UI ACTIONS ---

  changeMainImage(imageUrl: string): void {
    this.mainImage = imageUrl;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  ngOnDestroy(): void {
  if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  addToCart(product: Product): void {
    // In a real app, you'd check if size/color are selected
    if (!this.selectedSize) {
      this.notificationService.show('Please select a size.', 'error');
      return;
    }
    
    // Call the updated addToCart method with the product and quantity
    this.cartService.addToCart(product, this.quantity);
    this.notificationService.show('Added to cart!', 'success');
  }


    showPostalInput(): void {
    this.isPostalInputVisible = true;
  }

  checkDelivery(): void {
    // In a real app, you would have logic to validate the postal code.
    // For this example, we'll assume any input is valid.
    if (this.postalCode.trim().length > 0) {
      this.deliveryMessage = `✓ Free delivery is available for ${this.postalCode}!`;

      // Clear the message after 4 seconds to make the alert disappear.
      setTimeout(() => {
        this.deliveryMessage = '';
        this.isPostalInputVisible = false; // Optionally hide the input again
        this.postalCode = ''; // Optionally clear the input
      }, 4000);
    }
  }


  toggleWishlist(product: Product): void {
    // For simplicity, we assume the WishlistService handles checking existence
    this.wishlistService.addToWishlist(product);
    this.notificationService.show('Added to wishlist!', 'info');
  }
}
