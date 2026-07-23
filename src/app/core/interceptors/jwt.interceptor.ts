import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { RefreshTokenRequest } from '../../shared/models/auth.model';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authService = inject(AuthService);
  const token = tokenStorage.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {

      if (error.status !== 401) {
        return throwError(() => error);
      }

      const body: RefreshTokenRequest = {
        refreshToken: tokenStorage.getRefreshToken()
      }

      return authService.refreshToken(body).pipe(

        switchMap(res => {

          tokenStorage.saveToken(res.data.accessToken);
          tokenStorage.saveRefreshToken(res.data.refreshToken);
          tokenStorage.saveLoginData(res.data);

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });

          return next(retryReq);
        }),

        catchError(refreshError => {
          tokenStorage.clear();
          return throwError(() => refreshError);
        })
      );
    }),
  );
};
