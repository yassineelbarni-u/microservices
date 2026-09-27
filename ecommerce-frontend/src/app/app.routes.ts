import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
  }
];
