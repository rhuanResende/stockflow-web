import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const request = req.clone({
    withCredentials: true,
  });

  return next(request).pipe(
    catchError((error) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (request.url.includes('/auth/login')) {
        return throwError(() => error);
      }

      if (request.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap(() => {
          return next(request);
        }),

        catchError((refreshError) => {
          authService.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
