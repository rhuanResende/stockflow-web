import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  DsActionButtonType,
  DsButtonIconAlign,
  DsButtonSize,
  DsButtonType,
  DsColumn,
  DsColumnType,
  DsComponent,
  DsExtendedState,
  DsInputIconAlign,
  DsPageState,
} from '@rhuanResende/design-system';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserResponse } from '../../../../shared/models/users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../shared/services/company.service';
import { CompanyResponse } from '../../../../shared/models/company.model';
import { RoleResponse } from '../../../../shared/models/auth.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserAuthenticatedService } from '../../../../shared/services/user-authenticated.service';
import { UserService } from '../../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends DsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private reload$ = new Subject<void>();

  filterForm!: FormGroup;
  users: UserResponse[] = [];
  totalUsers: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  titleTable!: string;
  profile!: string;

  companies: CompanyResponse[] = [];
  profiles: RoleResponse[] = [];

  columnsProfileMaster: Array<DsColumn> = new Array<DsColumn>(
    { name: 'name', title: 'Nome', type: DsColumnType.text },
    { name: 'document', title: 'CPF', type: DsColumnType.cpfCnpj },
    { name: 'companyName', title: 'Empresa', type: DsColumnType.text },
    { name: 'profile', title: 'Perfil', type: DsColumnType.text },
    { name: 'status', title: 'Situação', type: DsColumnType.text },
    { name: 'actions', title: '' },
  );

  columnsUsers: Array<DsColumn> = new Array<DsColumn>(
    { name: 'name', title: 'Nome', type: DsColumnType.text },
    { name: 'document', title: 'CPF', type: DsColumnType.cpfCnpj },
    { name: 'profile', title: 'Perfil', type: DsColumnType.text },
    { name: 'status', title: 'Situação', type: DsColumnType.text },
    { name: 'actions', title: '' },
  );

  statusList: { id: string; label: string }[] = [
    { id: 'ATIVO', label: 'ATIVO' },
    { id: 'INATIVO', label: 'INATIVO' },
  ];

  protected readonly dsButtonSize = DsButtonSize;
  protected readonly dsButtonType = DsButtonType;
  protected readonly dsButtonIconAlign = DsButtonIconAlign;
  protected readonly dsActionButtonType = DsActionButtonType;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly companyService: CompanyService,
    private readonly userAuthenticatedService: UserAuthenticatedService,
    private readonly toastrService: ToastrService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super(injector);

    this.filterForm = this.fb.group({
      tenantId: [null],
      profileId: [null],
      name: [null],
      document: [null],
      status: [null],
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.profile = this.userAuthenticatedService.getUser().profile;

    this.getCompanies();
    this.getProfiles();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.pageIndex = 1;
        this.reload$.next();
      });

    this.reload$
      .pipe(
        switchMap(() =>
          this.userService.findAll(
            this.pageIndex - 1,
            this.pageSize,
            this.filterForm.get('tenantId')?.value,
            this.filterForm.get('profileId')?.value,
            this.filterForm.get('name')?.value,
            this.filterForm.get('document')?.value,
            this.filterForm.get('status')?.value,
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.users = res.data.content.map((user) => ({
              ...user,
              companyName: user.company?.name
            }));
            this.totalUsers = res.data.totalElements;
            this.getTitleTable();
          }
          this.cdr.detectChanges();
        },
        error: (err) => this.handlerError(err),
      });

    this.reload$.next();
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
  }

  filterClean(): void {
    this.filterForm.reset();
    this.reload$.next();
  }

  newRequest(): void {
    this.router.navigate(['/pages/users/create'], {
      relativeTo: this.activatedRoute,
    });
  }

  onPageChanged(event: DsPageState): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.reload$.next();
  }

  getLabelSituacao(status: any): string {
    return status ?? 'Status desconhecido';
  }

  getStateSituacao(status: any): DsExtendedState {
    if (status === 'ATIVO') return DsExtendedState.success;
    if (status === 'INATIVO') return DsExtendedState.error;
    return DsExtendedState.default;
  }

  search(user: UserResponse): void {
    this.router.navigate([`/pages/users/search/${user.id}/disable`], {
      relativeTo: this.activatedRoute,
    });
  }

  active(user: UserResponse): void {
    this.userService.activate(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.pageIndex = 1;
          this.reload$.next();
          this.handlerSuccess(res.message);
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  update(user: UserResponse): void {
    this.router.navigate([`/pages/users/edit/${user.id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  delete(user: UserResponse): void {
    this.userService.delete(user.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.handlerSuccess(res.message);
          this.pageIndex = 1;
          this.reload$.next();
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private getCompanies(): void {
    this.companyService.search().subscribe({
      next: (res) => {
        if (res.success) {
          this.companies = res.data;
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private getProfiles(): void {
    this.authService.getRoles().subscribe({
      next: (res) => {
        if (res.success) {
          this.profiles = res.data;
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private getTitleTable(): void {
    const qtd = this.totalUsers;
    this.titleTable =
      qtd > 1 ? `Existem ${qtd} usuários cadastrados!` : `Existe ${qtd} usuário cadastrado!`;
  }

  private handlerError(error: any): void {
    const message = error?.error?.message ?? error?.message ?? 'Ocorreu um erro inesperado';
    this.toastrService.error(message, 'Erro!', {
      positionClass: 'toast-top-right',
    });
  }

  private handlerSuccess(message: string): void {
    this.toastrService.success(message, 'Sucesso!', {
      positionClass: 'toast-top-right',
    });
  }

  protected readonly dsInputIconAlign = DsInputIconAlign;
}
