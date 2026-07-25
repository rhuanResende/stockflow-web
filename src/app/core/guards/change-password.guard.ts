import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { catchError, map, of } from 'rxjs';

export const changePasswordGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getMe().pipe(
    map((response) => {
      const user = response.data;

      if (user.firstAccess || user.forcePasswordChange) {
        return true;
      }

      return router.createUrlTree(['/pages/home']);
    }),

    catchError(() => {
      return of(router.createUrlTree(['/pages/login']));
    }),
  );
};
