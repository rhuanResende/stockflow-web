import { NgModule } from '@angular/core';
import { QuicklinkModule } from 'ngx-quicklink';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
  {
    path: 'pages',
    loadChildren: () => import('./features/features.module').then((m) => m.FeaturesModule),
  },
  {
    path: '**',
    redirectTo: 'pages/404',
  },
];

@NgModule({
  imports: [QuicklinkModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
