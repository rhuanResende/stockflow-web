import { NgModule } from '@angular/core';
import { FeaturesRoutingModule } from './features-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DesignSystemModule, MaterialModule } from '@rhuanResende/design-system';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutComponent } from '../layout/pages/layout.component';
import { SidebarComponent } from '../layout/components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
  ],
  imports: [
    FeaturesRoutingModule,
    CommonModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      countDuplicates: true,
      closeButton: true,
      enableHtml: true,
      toastClass: 'logica ds-toastr ngx-toastr',
    }),
    DesignSystemModule,
  ],
})
export class FeaturesModule {}
