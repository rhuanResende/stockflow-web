import { Component, OnInit } from '@angular/core';
import { DsActionButtonType } from '@rhuanResende/design-system';
import { Router } from '@angular/router';
import { SidebarItem } from '../../../core/models/sidebar.model';
import { SidebarService } from '../../../core/services/sidebar.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { LoggedUser } from '../../../core/models/logged-user.model';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public user!: LoggedUser;
  public firstName!: string;
  public isCollapsed = false;

  public menuItems: SidebarItem[] = [];

  protected readonly dsActionButtonType = DsActionButtonType;

  constructor(
    private readonly router: Router,
    private readonly sidebarService: SidebarService,
    private readonly tpkenStorageService: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.user = this.tpkenStorageService.getUser();
    this.firstName = this.user.name.split(' ')[0];
    const profile = this.user.profile;
    const permissions = this.user.permissions;
    this.menuItems = this.sidebarService.getMenyByPermission(profile, permissions);
  }

  public toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public executeAction(action?: string): void {
    switch (action) {
      case 'logout':
        this.logout();
        break;
    }
  }

  private logout(): void {
    this.tpkenStorageService.clear();
    this.router.navigate(['/']);
  }
}
