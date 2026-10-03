import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, timeout } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Global HTTP error interceptor.
 * - Adds a 30s timeout to every request (Spring Boot peut etre lent au demarrage)
 * - Catches all HTTP errors and displays a user-friendly toast message
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    timeout(30000),
    catchError((err) => {
      let message = 'Une erreur inattendue est survenue.';

      if (err.name === 'TimeoutError') {
        message = 'Le serveur met trop de temps a repondre. Verifiez que les services Spring Boot sont demarres.';
      } else if (err instanceof HttpErrorResponse) {
        if (err.status === 0) {
          message = 'Impossible de joindre le serveur. Verifiez que les services sont demarres.';
        } else if (err.status === 400) {
          const detail = err.error?.message || err.error?.error || null;
          message = detail ? `Donnees invalides : ${detail}` : 'Donnees invalides. Verifiez le formulaire.';
        } else if (err.status === 404) {
          message = 'Ressource introuvable.';
        } else if (err.status === 409) {
          const detail = err.error?.message || null;
          message = detail ?? 'Cette ressource existe deja.';
        } else if (err.status === 500) {
          message = 'Erreur interne du serveur. Consultez les logs Spring Boot.';
        }
      }

      toast.error(message);
      return throwError(() => err);
    })
  );
};