import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DesignSystemModule, MaterialModule } from '@rhuanResende/design-system';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    DesignSystemModule,
  ],
})
export class HomeModule {}
