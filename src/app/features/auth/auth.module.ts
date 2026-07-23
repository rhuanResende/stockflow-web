import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { DesignSystemModule, MaterialModule } from '@rhuanResende/design-system';

@NgModule({
  declarations: [LoginComponent],
  imports: [AuthRoutingModule, CommonModule, SharedModule, MaterialModule, DesignSystemModule],
})
export class AuthModule {}
