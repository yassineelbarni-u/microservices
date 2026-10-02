import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Toast notification service.
 *
 * Usage (inject anywhere):
 *   private toast = inject(ToastService);
 *   this.toast.success('Client créé avec succès !');
 *   this.toast.error('Une erreur est survenue.');
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;

  // Reactive list of active toasts, consumed by ToastContainerComponent
  toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  private show(message: string, type: ToastType, duration = 3500): void {
    const id = ++this.counter;
    this.toasts.update(list => [...list, { id, message, type }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
