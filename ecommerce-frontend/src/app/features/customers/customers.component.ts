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
      <h1>👥 Clients</h1>
      <p>Gestion de vos clients</p>
    </div>

    <div class="toolbar card" style="margin-bottom:1.25rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
      <div class="search-bar" style="flex:1; min-width:200px;">
        <span class="icon">🔍</span>
        <input [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Rechercher un client...">
      </div>
      <select [(ngModel)]="filterStatus" (ngModelChange)="loadCustomers()">
        <option value="">Tous les statuts</option>
        <option value="ACTIVE">Actif</option>
        <option value="INACTIVE">Inactif</option>
        <option value="SUSPENDED">Suspendu</option>
      </select>
      <button class="btn btn-primary" (click)="openModal()">+ Nouveau client</button>
    </div>

    <div class="card">
      @if (customers.length > 0) {
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (c of customers; track c.id) {
              <tr>
                <td><strong>{{ c.firstName }} {{ c.lastName }}</strong></td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone || '-' }}</td>
                <td><span class="badge" [class]="statusBadge(c.status!)">{{ c.status }}</span></td>
                <td>{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="actions">
                  <button class="btn btn-ghost" (click)="openModal(c)" style="padding:0.35rem 0.75rem" title="Modifier">✏️</button>
                  <button class="btn btn-danger" (click)="delete(c)" style="padding:0.35rem 0.75rem" title="Supprimer">🗑️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else if (loading) {
        <div class="empty-state">
          <div style="font-size:2rem; animation: spin 1s linear infinite; display:inline-block">⏳</div>
          <p>Chargement des clients...</p>
        </div>
      } @else if (error) {
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <p style="color:var(--danger)">Impossible de joindre le serveur.<br>Vérifiez que customer-service est démarré sur le port 8081.</p>
          <button class="btn btn-primary" style="margin-top:1rem" (click)="loadCustomers()">🔄 Réessayer</button>
        </div>
      } @else {
        <div class="empty-state">
          <div class="icon">👥</div>
          <p>Aucun client trouvé</p>
        </div>
      }
    </div>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingId ? 'Modifier' : 'Nouveau' }} client</h2>
            <button (click)="closeModal()">❌</button>
          </div>
          <div class="form-group"><label>Prénom *</label><input [(ngModel)]="form.firstName" placeholder="Prénom"></div>
          <div class="form-group"><label>Nom *</label><input [(ngModel)]="form.lastName" placeholder="Nom"></div>
          <div class="form-group"><label>Email *</label><input [(ngModel)]="form.email" type="email" placeholder="email@exemple.com"></div>
          <div class="form-group"><label>Téléphone</label><input [(ngModel)]="form.phone" placeholder="+212600000000"></div>
          <div class="form-group"><label>Adresse</label><input [(ngModel)]="form.address" placeholder="Adresse"></div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="save()">{{ editingId ? 'Enregistrer' : 'Créer' }}</button>
          </div>
        </div>
      </div>
    }
  `
})
export class CustomersComponent implements OnInit {
  private svc = inject(CustomerService);
  private toast = inject(ToastService);
  customers: Customer[] = [];
  search = '';
  filterStatus: any = '';
  showModal = false;
  editingId: number | null = null;
  form: Partial<Customer> = {};
  loading = false;
  error = false;

  ngOnInit() { this.loadCustomers(); }

  loadCustomers() {
    this.loading = true;
    this.error = false;
    this.svc.getAll(this.filterStatus || undefined, this.search || undefined)
      .subscribe({
        next: data => { this.customers = data; this.loading = false; },
        error: () => { this.loading = false; this.error = true; }
      });
  }

  onSearch() { if (this.search.length >= 2 || this.search === '') this.loadCustomers(); }

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
      this.toast.success(isEdit ? 'Client mis à jour avec succès !' : 'Client créé avec succès !');
    });
  }

  delete(c: Customer) {
    if (confirm(`Supprimer ${c.firstName} ${c.lastName} ?`))
      this.svc.delete(c.id!).subscribe(() => {
        this.loadCustomers();
        this.toast.success(`Client ${c.firstName} ${c.lastName} supprimé.`);
      });
  }

  statusBadge(s: string) {
    return { ACTIVE: 'badge badge-success', INACTIVE: 'badge badge-muted', SUSPENDED: 'badge badge-danger' }[s] || 'badge';
  }
}