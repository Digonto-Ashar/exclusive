import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface'; // This import is correct

// @Injectable tells Angular that this class can be injected as a dependency.
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  getProducts(limit?: number): Observable<Product[]> {
    let url = this.apiUrl;
        // If a limit was provided, add it to the URL as a query parameter
    if (limit) {
      url += `?limit=${limit}`;
    }
    
    // Make the HTTP request with the final URL
    return this.http.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    // This constructs the correct URL, e.g., https://fakestoreapi.com/products/5
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url);
  }
}


