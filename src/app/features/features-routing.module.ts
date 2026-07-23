import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LayoutComponent } from '../layout/pages/layout.component';
import { authGuard } from '../core/guards/auth.guard';
import { changePasswordGuard } from '../core/guards/change-password.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, changePasswordGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'companies',
        loadChildren: () => import('./company/company.module').then((m) => m.CompanyModule),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./change-password/change-password.module').then((m) => m.ChangePasswordModule),
  },
  {
    path: '404',
    loadChildren: () => import('./not-found/not-found-module').then((m) => m.NotFoundModule),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
