import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/pages/login/login.component';
import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordRoutingModule {}
