import { Component, Injector } from '@angular/core';
import {
  DsButtonIconAlign,
  DsButtonSize,
  DsButtonType,
  DsComponent,
  DsExtendedState,
} from '@rhuanResende/design-system';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pages',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent extends DsComponent {
  protected readonly dsIconBubbleState: typeof DsExtendedState = DsExtendedState;
  protected readonly dsButtonIconAlign = DsButtonIconAlign;
  protected readonly dsButtonSize = DsButtonSize;
  protected readonly dsButtonType = DsButtonType;

  constructor(
    injector: Injector,
    private readonly location: Location,
  ) {
    super(injector);
  }

  goBack(): void {
    this.location.back();
  }
}
