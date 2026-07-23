import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DesignSystemModule, DsTableCustomColumnDirective } from '@rhuanResende/design-system';
import { CompanyListComponent } from './pages/list/company-list.component';
import { CompanyCreateComponent } from './pages/create/company-create.component';
import { CompanyRoutingModule } from './company-routing.module';

@NgModule({
  declarations: [CompanyListComponent, CompanyCreateComponent],
  imports: [
    CompanyRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    DesignSystemModule,
    DsTableCustomColumnDirective,
  ],
})
export class CompanyModule {}
