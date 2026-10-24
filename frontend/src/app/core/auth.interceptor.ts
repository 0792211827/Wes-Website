import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AdminService } from './admin.service';

/** Adds the admin token to /api/admin calls and signs out when it has expired. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const admin = inject(AdminService);
  const token = admin.token();
  if (!token || !req.url.includes('/api/admin')) return next(req);
  return next(req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) admin.logout();
      return throwError(() => err);
    })
  );
};
