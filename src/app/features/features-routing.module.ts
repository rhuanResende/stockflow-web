import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LayoutComponent } from '../layout/pages/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [],
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
