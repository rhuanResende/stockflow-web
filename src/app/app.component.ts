import { Component, Injector } from '@angular/core';
import { ContextService, DsComponent, DsTheme, DsThemeService } from '@rhuanResende/design-system';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DsComponent {
  constructor(
    injector: Injector,
    private readonly contextService: ContextService,
    private readonly themeService: DsThemeService,
  ) {
    super(injector);
    this.contextService.initialize('stockflow');
    this.themeService.setTheme(DsTheme.light);
  }
}
