import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>📊 Dashboard</h1>
      <p>Vue d'ensemble de votre plateforme e-commerce</p>
    </div>

    <div class="stats-grid">
      @for (stat of stats; track stat.label) {
        <div class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
          <a [routerLink]="stat.link" class="stat-link">Voir ➔</a>
        </div>
      }
    </div>

    <div class="recent-section">
      <div class="card">
        <h2>Commandes récentes</h2>
        @if (recentOrders.length > 0) {
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client ID</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (o of recentOrders; track o.id) {
                <tr>
                  <td>#{{ o.id }}</td>
                  <td>Client {{ o.customerId }}</td>
                  <td>{{ o.totalAmount | number:'1.2-2' }} MAD</td>
                  <td><span class="badge" [class]="getBadgeClass(o.status!)">{{ o.status }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="empty-state">
            <p>Aucune commande récente</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
    .stat-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.5rem; display: flex; align-items: center; gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s; position: relative;
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.15); border-color: var(--accent); }
    .stat-icon { font-size: 2rem; }
    .stat-value { font-size: 2rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
    .stat-link { position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--accent-light); text-decoration: none; font-size: 0.8rem; }
    .recent-section h2 { margin-bottom: 1rem; font-size: 1rem; font-weight: 600; }
  `]
})
export class DashboardComponent implements OnInit {
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  stats = [
    { icon: '👥', value: 0, label: 'Clients', link: '/customers' },
    { icon: '📦', value: 0, label: 'Produits', link: '/products' },
    { icon: '🛒', value: 0, label: 'Commandes', link: '/orders' },
    { icon: '💰', value: '0 MAD', label: 'Chiffre d\'affaires', link: '/orders' }
  ];

  recentOrders: any[] = [];

  ngOnInit() {
    forkJoin({
      customers: this.customerService.getAll(),
      products: this.productService.getAll(),
      orders: this.orderService.getAll()
    }).subscribe(({ customers, products, orders }) => {
      this.stats[0].value = customers.length;
      this.stats[1].value = products.length;
      this.stats[2].value = orders.length;
      const total = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      this.stats[3].value = total.toFixed(2) + ' MAD';
      this.recentOrders = orders.slice(-5).reverse();
    });
  }

  getBadgeClass(status: string) {
    const map: Record<string, string> = {
      DELIVERED: 'badge-success', CONFIRMED: 'badge-info',
      PENDING: 'badge-warning', CANCELLED: 'badge-danger', SHIPPED: 'badge-info'
    };
    return 'badge ' + (map[status] || 'badge-muted');
  }
}