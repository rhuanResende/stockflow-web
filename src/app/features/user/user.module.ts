import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DesignSystemModule, DsTableCustomColumnDirective } from '@rhuanResende/design-system';
import { UserListComponent } from './pages/list/user-list.component';
import { UserCreateComponent } from './pages/create/user-create.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserListComponent, UserCreateComponent],
  imports: [
    UserRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    DesignSystemModule,
    DsTableCustomColumnDirective,
  ],
})
export class UserModule {}
