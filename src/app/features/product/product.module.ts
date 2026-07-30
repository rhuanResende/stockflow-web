import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DesignSystemModule, DsTableCustomColumnDirective } from '@rhuanResende/design-system';
import { ProductListComponent } from './pages/list/product-list.component';
import { ProductCreateComponent } from './pages/create/product-create.component';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [ProductListComponent, ProductCreateComponent],
  imports: [
    ProductRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    DesignSystemModule,
    DsTableCustomColumnDirective,
  ],
})
export class ProductModule {}
