import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyListComponent } from './pages/list/company-list.component';
import { CompanyCreateComponent } from './pages/create/company-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: CompanyListComponent,
  },
  {
    path: 'create',
    component: CompanyCreateComponent,
  },
  {
    path: 'edit/:id',
    component: CompanyCreateComponent,
  },
  {
    path: 'search/:id/:state',
    component: CompanyCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
