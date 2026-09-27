import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>📦 Produits</h1>
      <p>Gestion du catalogue et du stock</p>
    </div>

    <div class="toolbar card" style="margin-bottom:1.25rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
      <div class="search-bar" style="flex:1; min-width:200px;">
        <span class="icon">🔍</span>
        <input [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Rechercher un produit...">
      </div>
      <select [(ngModel)]="filterCategory" (ngModelChange)="loadProducts()">
        <option value="">Toutes catégories</option>
        @for (c of categories; track c) {
          <option [value]="c">{{ c }}</option>
        }
      </select>
      <select [(ngModel)]="filterStatus" (ngModelChange)="loadProducts()">
        <option value="">Tous statuts</option>
        <option value="AVAILABLE">Disponible</option>
        <option value="OUT_OF_STOCK">Rupture</option>
        <option value="DISCONTINUED">Discontinué</option>
      </select>
      <button class="btn btn-primary" (click)="openModal()">+ Nouveau produit</button>
    </div>

    <div class="card">
      @if (products.length > 0) {
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of products; track p.id) {
              <tr>
                <td>
                  <strong>{{ p.name }}</strong><br>
                  <small style="color:var(--text-muted)">{{ p.description }}</small>
                </td>
                <td><span class="badge badge-info">{{ p.category }}</span></td>
                <td>{{ p.price | number:'1.2-2' }} MAD</td>
                <td>
                  <span [style.color]="p.quantity === 0 ? 'var(--danger)' : p.quantity < 10 ? 'var(--warning)' : 'var(--success)'">
                    {{ p.quantity }} unités
                  </span>
                </td>
                <td><span class="badge" [class]="statusBadge(p.status!)">{{ p.status }}</span></td>
                <td class="actions">
                  <button class="btn btn-ghost" (click)="openModal(p)" style="padding:0.35rem 0.75rem" title="Modifier">✏️</button>
                  <button class="btn btn-danger" (click)="delete(p)" style="padding:0.35rem 0.75rem" title="Supprimer">🗑️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="empty-state">
          <div class="icon">📦</div>
          <p>Aucun produit trouvé</p>
        </div>
      }
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingId ? 'Modifier' : 'Nouveau' }} produit</h2>
            <button (click)="closeModal()">❌</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;">
            <div class="form-group" style="grid-column:1/-1">
              <label>Nom *</label>
              <input [(ngModel)]="form.name" placeholder="Nom du produit">
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Description</label>
              <input [(ngModel)]="form.description" placeholder="Description">
            </div>
            <div class="form-group">
              <label>Prix (MAD) *</label>
              <input [(ngModel)]="form.price" type="number" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Stock *</label>
              <input [(ngModel)]="form.quantity" type="number" placeholder="0">
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Catégorie *</label>
              <input [(ngModel)]="form.category" placeholder="Ex: Electronics, Furniture...">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="save()">{{ editingId ? 'Enregistrer' : 'Créer' }}</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductsComponent implements OnInit {
  private svc = inject(ProductService);
  products: Product[] = [];
  categories = ['Electronics', 'Furniture', 'Clothing', 'Food', 'Other'];
  search = ''; filterCategory: any = ''; filterStatus: any = '';
  showModal = false; editingId: number | null = null; form: Partial<Product> = {};

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.svc.getAll(this.filterStatus || undefined, this.filterCategory || undefined, this.search || undefined)
      .subscribe(data => this.products = data);
  }

  onSearch() { if (this.search.length >= 2 || this.search === '') this.loadProducts(); }
  openModal(p?: Product) { this.editingId = p?.id ?? null; this.form = p ? { ...p } : {}; this.showModal = true; }
  closeModal() { this.showModal = false; this.form = {}; this.editingId = null; }

  save() {
    if (!this.form.name || !this.form.price || this.form.quantity === undefined || !this.form.category) return;
    const obs = this.editingId ? this.svc.update(this.editingId, this.form as Product) : this.svc.create(this.form as Product);
    obs.subscribe(() => { this.closeModal(); this.loadProducts(); });
  }

  delete(p: Product) {
    if (confirm(`Supprimer "${p.name}" ?`)) this.svc.delete(p.id!).subscribe(() => this.loadProducts());
  }

  statusBadge(s: string) {
    return { AVAILABLE: 'badge badge-success', OUT_OF_STOCK: 'badge badge-danger', DISCONTINUED: 'badge badge-muted' }[s] || 'badge';
  }
}