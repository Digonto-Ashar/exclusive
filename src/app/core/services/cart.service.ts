import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { CartItem } from '../interfaces/cart-item.interface';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  // A key for storing the cart data in localStorage
  private readonly CART_STORAGE_KEY = 'my-app-cart';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // --- 1. LOAD CART FROM LOCALSTORAGE WHEN THE SERVICE STARTS ---
    this.loadCartFromStorage();
  }

  // --- HELPER METHOD TO CHECK IF WE ARE IN A BROWSER ---
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // --- HELPER METHOD TO SAVE THE CART ---
  private saveCartToStorage(items: CartItem[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
      this.cartItemsSubject.next(items);
    }
  }

  // --- HELPER METHOD TO LOAD THE CART ---
  private loadCartFromStorage(): void {
    if (this.isBrowser()) {
      const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (storedCart) {
        this.cartItemsSubject.next(JSON.parse(storedCart));
      }
    }
  }

  // ---  ADD TO CART ---
addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.getValue();
    const itemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    this.saveCartToStorage([...currentItems]);
  }

  // --- UPDATED METHOD: UPDATE QUANTITY ---
  updateQuantity(productId: number, quantity: number): void {
    let currentItems = this.cartItemsSubject.getValue();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1 && quantity > 0) {
      currentItems[itemIndex].quantity = quantity;
    } else if (quantity === 0) {
      // If quantity is set to 0, filter it out (remove the item)
      currentItems = currentItems.filter(item => item.product.id !== productId);
    }
    this.saveCartToStorage(currentItems);
  }


    // --- THIS IS THE NEW METHOD FOR "MOVE ALL TO BAG" ---
  public addItems(products: Product[]): void {
    const currentItems = this.cartItemsSubject.getValue();

    // Loop through each product from the wishlist
    products.forEach(product => {
      const itemIndex = currentItems.findIndex(item => item.product.id === product.id);
      
      // If the item already exists in the cart, just increase its quantity
      if (itemIndex > -1) {
        currentItems[itemIndex].quantity++;
      } else {
        // Otherwise, add it as a new item
        currentItems.push({ product, quantity: 1 });
      }
    });

    // Save the final, updated list to storage once after the loop is done.
    this.saveCartToStorage([...currentItems]);
  }

  // --- UPDATED METHOD: REMOVE FROM CART ---
  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.getValue()
      .filter(item => item.product.id !== productId);
    this.saveCartToStorage(currentItems);
  }
}
