import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>&#x1F465; Clients</h1>
      <p>Gestion de vos clients</p>
    </div>

    <div class="toolbar card" style="margin-bottom:1.25rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
      <div class="search-bar" style="flex:1; min-width:200px;">
        <span class="icon">&#x1F50D;</span>
        <input [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Rechercher un client...">
      </div>
      <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilters()">
        <option value="">Tous les statuts</option>
        <option value="ACTIVE">Actif</option>
        <option value="INACTIVE">Inactif</option>
        <option value="SUSPENDED">Suspendu</option>
      </select>
      <button class="btn btn-primary" (click)="openModal()">+ Nouveau client</button>
    </div>

    <div class="card">
      @if (loading) {
        <div class="empty-state">
          <div style="font-size:2rem;">&#x23F3;</div>
          <p>Chargement des clients...</p>
        </div>
      } @else if (hasError) {
        <div class="empty-state">
          <div class="icon">&#x26A0;&#xFE0F;</div>
          <p style="color:var(--danger)">Impossible de joindre le serveur.<br>Verifiez que customer-service est demarre sur le port 8081.</p>
          <button class="btn btn-primary" style="margin-top:1rem" (click)="loadCustomers()">&#x1F504; Reessayer</button>
        </div>
      } @else if (filtered.length > 0) {
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Statut</th>
              <th>Cree le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered; track c.id) {
              <tr>
                <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone || '-' }}</td>
                <td><span class="badge" [class]="statusBadge(c.status!)">{{ c.status }}</span></td>
                <td>{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="actions">
                  <button class="btn btn-ghost" (click)="openModal(c)" style="padding:0.35rem 0.75rem" title="Modifier">&#x270F;&#xFE0F;</button>
                  <button class="btn btn-danger" (click)="delete(c)" style="padding:0.35rem 0.75rem" title="Supprimer">&#x1F5D1;&#xFE0F;</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="empty-state">
          <div class="icon">&#x1F465;</div>
          <p>Aucun client trouve</p>
        </div>
      }
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingId ? 'Modifier' : 'Nouveau' }} client</h2>
            <button (click)="closeModal()">&#x2715;</button>
          </div>
          <div class="form-group"><label>Prenom *</label><input [(ngModel)]="form.firstName" placeholder="Prenom"></div>
          <div class="form-group"><label>Nom *</label><input [(ngModel)]="form.lastName" placeholder="Nom"></div>
          <div class="form-group"><label>Email *</label><input [(ngModel)]="form.email" type="email" placeholder="email@exemple.com"></div>
          <div class="form-group"><label>Telephone</label><input [(ngModel)]="form.phone" placeholder="+212600000000"></div>
          <div class="form-group"><label>Adresse</label><input [(ngModel)]="form.address" placeholder="Adresse"></div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="save()">{{ editingId ? 'Enregistrer' : 'Creer' }}</button>
          </div>
        </div>
      </div>
    }
  `
})
export class CustomersComponent implements OnInit {
  private svc = inject(CustomerService);
  private toast = inject(ToastService);

  // Toutes les donnees chargees depuis le backend
  allCustomers: Customer[] = [];
  // Donnees filtrees affichees dans la table
  filtered: Customer[] = [];

  search = '';
  filterStatus = '';
  showModal = false;
  editingId: number | null = null;
  form: Partial<Customer> = {};
  loading = false;
  hasError = false;

  ngOnInit() { this.loadCustomers(); }

  /** Charge TOUS les clients depuis le backend une seule fois */
  loadCustomers() {
    this.loading = true;
    this.hasError = false;
    this.svc.getAll()
      .subscribe({
        next: data => {
          this.allCustomers = data;
          this.loading = false;
          this.applyFilters();
        },
        error: () => {
          this.loading = false;
          this.hasError = true;
        }
      });
  }

  /** Filtre localement sans faire de requete reseau */
  applyFilters() {
    let result = [...this.allCustomers];

    if (this.filterStatus) {
      result = result.filter(c => c.status === this.filterStatus);
    }

    if (this.search && this.search.length >= 2) {
      const q = this.search.toLowerCase();
      result = result.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    }

    this.filtered = result;
  }

  openModal(c?: Customer) {
    this.editingId = c?.id ?? null;
    this.form = c ? { ...c } : {};
    this.showModal = true;
  }

  closeModal() { this.showModal = false; this.form = {}; this.editingId = null; }

  save() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email) return;
    const isEdit = !!this.editingId;
    const obs = isEdit
      ? this.svc.update(this.editingId!, this.form as Customer)
      : this.svc.create(this.form as Customer);
    obs.subscribe(() => {
      this.closeModal();
      this.loadCustomers();
      this.toast.success(isEdit ? 'Client mis a jour avec succes !' : 'Client cree avec succes !');
    });
  }

  delete(c: Customer) {
    if (confirm(`Supprimer ${c.firstName} ${c.lastName} ?`))
      this.svc.delete(c.id!).subscribe(() => {
        this.loadCustomers();
        this.toast.success(`Client ${c.firstName} ${c.lastName} supprime.`);
      });
  }

  statusBadge(s: string) {
    return { ACTIVE: 'badge badge-success', INACTIVE: 'badge badge-muted', SUSPENDED: 'badge badge-danger' }[s] || 'badge';
  }
}