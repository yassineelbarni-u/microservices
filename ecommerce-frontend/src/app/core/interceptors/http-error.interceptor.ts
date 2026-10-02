import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, timeout } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Global HTTP error interceptor.
 * - Adds a 10s timeout to every request (prevents infinite loading)
 * - Catches all HTTP errors and displays a user-friendly toast message
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    timeout(10000),   // ← max 10 secondes par requête
    catchError((error) => {
      let message = 'Une erreur inattendue est survenue.';

      if (error.name === 'TimeoutError') {
        message = 'Le serveur met trop de temps à répondre (timeout 10s). Vérifiez que les services Spring Boot sont démarrés.';
      } else if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          message = 'Impossible de joindre le serveur. Vérifiez que les services sont démarrés.';
        } else if (error.status === 400) {
          const detail = error.error?.message || error.error?.error || null;
          message = detail ? `Données invalides : ${detail}` : 'Données invalides. Vérifiez le formulaire.';
        } else if (error.status === 404) {
          message = 'Ressource introuvable.';
        } else if (error.status === 409) {
          const detail = error.error?.message || null;
          message = detail ?? 'Cette ressource existe déjà.';
        } else if (error.status === 500) {
          message = 'Erreur interne du serveur. Consultez les logs Spring Boot.';
        }
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};
      let message = 'Une erreur inattendue est survenue.';

      if (error.status === 0) {
        // Network error / backend not reachable
        message = 'Impossible de joindre le serveur. Vérifiez que les services sont démarrés.';
      } else if (error.status === 400) {
        // Validation error — try to extract backend message
        const detail = error.error?.message || error.error?.error || null;
        message = detail ? `Données invalides : ${detail}` : 'Données invalides. Vérifiez le formulaire.';
      } else if (error.status === 404) {
        message = 'Ressource introuvable.';
      } else if (error.status === 409) {
        // Duplicate / already exists
        const detail = error.error?.message || null;
        message = detail ?? 'Cette ressource existe déjà.';
      } else if (error.status === 500) {
        message = 'Erreur interne du serveur. Consultez les logs Spring Boot.';
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};
