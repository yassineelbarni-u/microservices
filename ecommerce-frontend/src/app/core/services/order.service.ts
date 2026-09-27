import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/orders`;

  getAll(status?: OrderStatus, customerId?: number): Observable<Order[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (customerId) params = params.set('customerId', customerId.toString());
    return this.http.get<Order[]>(this.url, { params });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.url, order);
  }

  updateStatus(id: number, newStatus: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${id}/status`, null, {
      params: { newStatus }
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
