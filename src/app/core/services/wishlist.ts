import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_STORAGE_KEY = 'my-app-wishlist';
  private wishlistItems = new BehaviorSubject<Product[]>(this.getWishlistFromStorage());
  
  public wishlistItems$ = this.wishlistItems.asObservable();

  constructor() { }

  private getWishlistFromStorage(): Product[] {
    const storedWishlist = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  private saveWishlistToStorage(items: Product[]): void {
    localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(items));
    this.wishlistItems.next(items);
  }

  public addToWishlist(product: Product): void {
    const currentItems = this.getWishlistFromStorage();
    if (!currentItems.find(item => item.id === product.id)) {
      const updatedItems = [...currentItems, product];
      this.saveWishlistToStorage(updatedItems);
    }
  }

  public removeFromWishlist(productId: number): void {
    const currentItems = this.getWishlistFromStorage();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.saveWishlistToStorage(updatedItems);
  }
  
  public clearWishlist(): void {
    this.saveWishlistToStorage([]);
  }

  public isItemInWishlist(productId: number): boolean {
    return this.getWishlistFromStorage().some(item => item.id === productId);
  }
}
