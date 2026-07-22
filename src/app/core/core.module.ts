import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
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
export class CoreModule {}
