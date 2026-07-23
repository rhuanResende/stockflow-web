import { Component } from '@angular/core';
import { DsComponent } from '@rhuanResende/design-system';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends DsComponent {}
