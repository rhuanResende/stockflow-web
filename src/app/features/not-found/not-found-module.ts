import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing-module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NotFoundComponent } from './pages/not-found.component';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class NotFoundModule {}
