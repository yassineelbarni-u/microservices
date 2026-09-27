import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="brand">
        <span class="brand-icon">🛍️</span>
        <span class="brand-name">MicroShop</span>
      </div>
      <ul class="nav-list">
        @for (item of navItems; track item.path) {
          <li>
            <a [routerLink]="item.path" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          </li>
        }
      </ul>
      <div class="sidebar-footer">
        <span class="status-dot"></span>
        <span>Backend Connecté</span>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 0.5rem 1.75rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-name { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
    .nav-list { list-style: none; display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.875rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s;
    }
    .nav-item:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: var(--accent-glow);
      color: var(--accent-light);
      border-left: 2px solid var(--accent);
    }
    .nav-icon { font-size: 1.1rem; }
    .sidebar-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0.5rem 0;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.75rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class SidebarComponent {
  navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/customers', icon: '👥', label: 'Clients' },
    { path: '/products',  icon: '📦', label: 'Produits' },
    { path: '/orders',    icon: '🛒', label: 'Commandes' }
  ];
}