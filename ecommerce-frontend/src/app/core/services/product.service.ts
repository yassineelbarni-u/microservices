import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductStatus } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/products`;

  getAll(status?: ProductStatus, category?: string, search?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get<Product[]>(this.url, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
