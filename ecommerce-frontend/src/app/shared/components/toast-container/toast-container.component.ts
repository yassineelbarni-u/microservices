import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

/**
 * Renders all active toast notifications in the top-right corner.
 * Add <app-toast-container /> inside the root AppComponent template.
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type" role="alert">
          <span class="toast-icon">{{ iconFor(toast) }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)" aria-label="Fermer">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      max-width: 380px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 10px;
      border-left: 4px solid transparent;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      font-size: 0.875rem;
      font-weight: 500;
      color: #f1f5f9;
      animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: all;
    }

    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }

    .toast--success {
      background: rgba(34, 197, 94, 0.15);
      border-color: #22c55e;
    }

    .toast--error {
      background: rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
    }

    .toast--info {
      background: rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
    }

    .toast--warning {
      background: rgba(245, 158, 11, 0.15);
      border-color: #f59e0b;
    }

    .toast-icon { font-size: 1.1rem; flex-shrink: 0; }

    .toast-msg { flex: 1; line-height: 1.4; }

    .toast-close {
      background: none;
      border: none;
      color: rgba(241, 245, 249, 0.5);
      cursor: pointer;
      font-size: 0.75rem;
      padding: 0.2rem;
      transition: color 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover { color: #f1f5f9; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  iconFor(toast: Toast): string {
    const icons: Record<string, string> = {
      success: '✅',
      error:   '❌',
      info:    'ℹ️',
      warning: '⚠️'
    };
    return icons[toast.type] ?? 'ℹ️';
  }
}
