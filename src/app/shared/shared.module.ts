import { NgModule } from '@angular/core';
import { DesignSystemModule } from '@rhuanResende/design-system';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    DesignSystemModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      countDuplicates: true,
      closeButton: true,
      enableHtml: true,
      toastClass: 'logica ds-toastr ngx-toastr',
    }),
  ],
})
export class SharedModule {}
