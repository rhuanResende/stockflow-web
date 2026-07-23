import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DesignSystemModule } from '@rhuanResende/design-system';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    ChangePasswordRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    DesignSystemModule,
  ],
})
export class ChangePasswordModule {}
