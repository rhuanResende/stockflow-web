import { Component, Injector, OnInit } from '@angular/core';
import { DsActionButtonType, DsComponent, isNull } from '@rhuanResende/design-system';
import { Router } from '@angular/router';
import { SidebarItem } from '../../../core/models/sidebar.model';
import { SidebarService } from '../../../core/services/sidebar.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { UserAuthenticatedService } from '../../../shared/services/user-authenticated.service';
import { UserResponse } from '../../../shared/models/users.model';
import { AuthService } from '../../../shared/services/auth.service';
import { LogoutRequest } from '../../../shared/models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent extends DsComponent implements OnInit {
  public user!: UserResponse;
  public firstName!: string;
  public isCollapsed = false;

  public menuItems: SidebarItem[] = [];

  protected readonly dsActionButtonType = DsActionButtonType;

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sidebarService: SidebarService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly userAuthenticatedService: UserAuthenticatedService,
    private readonly toastrService: ToastrService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    this.user = this.userAuthenticatedService.getUser();
    if (isNull(this.user)) {
      this.logout();
    }
    this.firstName = this.user.name.split(' ')[0];
    const profile = this.user.profile;
    this.menuItems = this.sidebarService.getMenyByPermission(profile);
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
    const body: LogoutRequest = {
      refreshToken: this.tokenStorageService.getRefreshToken(),
    };

    this.authService.logout(body).subscribe({
      next: (res) => {
        if (res.success) {
          this.tokenStorageService.clear();
          this.router.navigate(['/']);
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private handlerError(error: any): void {
    const message = error?.error?.message ?? error?.message ?? 'Ocorreu um erro inesperado';
    this.toastrService.error(message, 'Erro!', {
      positionClass: 'toast-top-right',
    });
  }
}
