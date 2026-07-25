import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing-module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NotFoundComponent } from './pages/not-found.component';
import { DesignSystemModule } from '@rhuanResende/design-system';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    NotFoundRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    DesignSystemModule
  ],
})
export class NotFoundModule {}
