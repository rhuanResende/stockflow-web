import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

export const changePasswordGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const mustChangePassword = tokenStorage.isFirstAccess();

  if (!mustChangePassword && state.url !== '/change-password') {
    return router.createUrlTree(['/pages/change-password']);
  }

  return true;
};
