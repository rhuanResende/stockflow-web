import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import moment from 'moment';
import 'moment/locale/pt-br';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from '../environments/environments';
import { DesignSystemModule } from '@rhuanResende/design-system';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

registerLocaleData(localePt, 'pt-BR');
moment.locale('pt-br');

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // entrada
  },
  display: {
    dateInput: 'DD/MM/YYYY', // input no campo
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@NgModule({
  declarations: [AppComponent],
  exports: [],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FlexLayoutModule,
    SharedModule,
    ReactiveFormsModule,
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
  providers: [
    provideHttpClient(withInterceptors([])),
    provideNgxMask(),
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR',
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS,
    },
    {
      provide: 'ENVIRONMENT',
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
