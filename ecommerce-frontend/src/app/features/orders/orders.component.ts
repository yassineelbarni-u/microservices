import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { CustomerService } from '../../core/services/customer.service';
import { ProductService } from '../../core/services/product.service';
import { Order, OrderItem, OrderStatus } from '../../core/models/order.model';
import { Customer } from '../../core/models/customer.model';
import { Product } from '../../core/models/product.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>🛒 Commandes</h1>
      <p>Gestion des commandes clients</p>
    </div>

    <div class="toolbar card" style="margin-bottom:1.25rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
      <select [(ngModel)]="filterStatus" (ngModelChange)="loadOrders()">
        <option value="">Tous les statuts</option>
        @for (s of statuses; track s) {
          <option [value]="s">{{ s }}</option>
        }
      </select>
      <button class="btn btn-primary" (click)="openModal()">+ Nouvelle commande</button>
    </div>

    <div class="card">
      @if (orders.length > 0) {
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (o of orders; track o.id) {
              <tr>
                <td><strong>#{{ o.id }}</strong></td>
                <td>{{ getCustomerName(o.customerId) }}</td>
                <td>{{ o.items?.length || 0 }} article(s)</td>
                <td><strong>{{ o.totalAmount | number:'1.2-2' }} MAD</strong></td>
                <td>
                  <select class="status-select" [ngModel]="o.status" (ngModelChange)="updateStatus(o, $event)">
                    @for (s of statuses; track s) {
                      <option [value]="s">{{ s }}</option>
                    }
                  </select>
                </td>
                <td>{{ o.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="actions">
                  <button class="btn btn-danger" (click)="delete(o)" style="padding:0.35rem 0.75rem" title="Supprimer">🗑️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="empty-state">
          <div class="icon">🛒</div>
          <p>Aucune commande trouvée</p>
        </div>
      }
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" style="max-width:640px" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nouvelle commande</h2>
            <button (click)="closeModal()">❌</button>
          </div>

          <div class="form-group">
            <label>Client *</label>
            <select [(ngModel)]="newOrder.customerId">
              <option value="">Sélectionner un client</option>
              @for (c of customers; track c.id) {
                <option [value]="c.id">{{ c.firstName }} {{ c.lastName }} - {{ c.email }}</option>
              }
            </select>
          </div>

          <div style="margin-bottom:1rem">
            <label style="display:block; margin-bottom:0.5rem; font-size:0.8rem; font-weight:500; color:var(--text-secondary)">Ajouter des articles</label>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:flex-end;">
              <div style="flex:2; min-width:150px">
                <select [(ngModel)]="selectedProduct">
                  <option [value]="null">Choisir un produit</option>
                  @for (p of products; track p.id) {
                    <option [ngValue]="p">{{ p.name }} - {{ p.price }} MAD</option>
                  }
                </select>
              </div>
              <div style="width:80px">
                <input [(ngModel)]="selectedQty" type="number" min="1" placeholder="Qté">
              </div>
              <button class="btn btn-ghost" (click)="addItem()">Ajouter</button>
            </div>
          </div>

          @if (newOrder.items.length > 0) {
            <div class="items-list">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Qté</th>
                    <th>Sous-total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of newOrder.items; track $index) {
                    <tr>
                      <td>{{ item.productName }}</td>
                      <td>{{ item.unitPrice }} MAD</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.unitPrice * item.quantity | number:'1.2-2' }} MAD</td>
                      <td>
                        <button class="btn btn-danger" (click)="removeItem($index)" style="padding:0.2rem 0.5rem">❌</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <div style="text-align:right; padding:0.75rem 1rem; font-weight:700; color:var(--accent-light)">
                Total : {{ getTotal() | number:'1.2-2' }} MAD
              </div>
            </div>
          }

          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="!newOrder.customerId || newOrder.items.length === 0">Créer la commande</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .status-select { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); border-radius: 6px; padding: 0.3rem 0.5rem; font-size: 0.8rem; cursor: pointer; }
    .items-list { margin: 0.5rem 0 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
  `]
})
export class OrdersComponent implements OnInit {
  private orderSvc = inject(OrderService);
  private customerSvc = inject(CustomerService);
  private productSvc = inject(ProductService);

  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  filterStatus: any = '';
  showModal = false;
  selectedProduct: Product | null = null;
  selectedQty = 1;
  newOrder: { customerId: any; items: OrderItem[] } = { customerId: '', items: [] };

  ngOnInit() {
    forkJoin({ customers: this.customerSvc.getAll(), products: this.productSvc.getAll() })
      .subscribe(({ customers, products }) => { this.customers = customers; this.products = products; });
    this.loadOrders();
  }

  loadOrders() {
    this.orderSvc.getAll(this.filterStatus || undefined).subscribe(data => this.orders = data);
  }

  getCustomerName(id: number) {
    const c = this.customers.find(c => c.id === id);
    return c ? `${c.firstName} ${c.lastName}` : `Client #${id}`;
  }

  openModal() { this.newOrder = { customerId: '', items: [] }; this.showModal = true; }
  closeModal() { this.showModal = false; }

  addItem() {
    if (!this.selectedProduct || this.selectedQty < 1) return;
    this.newOrder.items.push({
      productId: this.selectedProduct.id!,
      productName: this.selectedProduct.name,
      unitPrice: this.selectedProduct.price,
      quantity: this.selectedQty
    });
    this.selectedProduct = null; this.selectedQty = 1;
  }

  removeItem(i: number) { this.newOrder.items.splice(i, 1); }
  getTotal() { return this.newOrder.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0); }

  save() {
    if (!this.newOrder.customerId || this.newOrder.items.length === 0) return;
    this.orderSvc.create(this.newOrder as Order).subscribe(() => { this.closeModal(); this.loadOrders(); });
  }

  updateStatus(o: Order, status: OrderStatus) {
    this.orderSvc.updateStatus(o.id!, status).subscribe(() => this.loadOrders());
  }

  delete(o: Order) {
    if (confirm(`Supprimer la commande #${o.id} ?`)) this.orderSvc.delete(o.id!).subscribe(() => this.loadOrders());
  }
}