import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerStatus } from '../models/customer.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/customers`;

  getAll(status?: CustomerStatus, search?: string): Observable<Customer[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    return this.http.get<Customer[]>(this.url, { params });
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.url, customer);
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}/${id}`, customer);
  }

  changeStatus(id: number, newStatus: CustomerStatus): Observable<Customer> {
    return this.http.patch<Customer>(`${this.url}/${id}/status`, null, {
      params: { newStatus }
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
