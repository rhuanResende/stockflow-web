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
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyResponse } from '../../../../shared/models/company.model';
import { CompanyService } from '../../../../shared/services/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent extends DsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private reload$ = new Subject<void>();

  filterForm!: FormGroup;
  companies: CompanyResponse[] = [];
  totalCompanies: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  titleTable!: string;

  columns: Array<DsColumn> = new Array<DsColumn>(
    { name: 'name', title: 'Nome', type: DsColumnType.text },
    { name: 'document', title: 'CPF/CNPJ', type: DsColumnType.cpfCnpj },
    { name: 'status', title: 'Situação', type: DsColumnType.text },
    { name: 'actions', title: '' },
  );

  statusList: { id: string; label: string }[] = [
    { id: 'ATIVO', label: 'ATIVO' },
    { id: 'INATIVO', label: 'INATIVO' },
  ];

  protected readonly dsActionButtonType: typeof DsActionButtonType = DsActionButtonType;
  protected readonly dsButtonIconAlign: typeof DsButtonIconAlign = DsButtonIconAlign;
  protected readonly dsButtonSize: typeof DsButtonSize = DsButtonSize;
  protected readonly dsButtonType: typeof DsButtonType = DsButtonType;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly companyService: CompanyService,
    private readonly toastrService: ToastrService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super(injector);

    this.filterForm = this.fb.group({
      name: [null],
      document: [null],
      status: [null],
    });
  }

  override ngOnInit() {
    super.ngOnInit();
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
          this.companyService.findAll(
            this.pageIndex - 1,
            this.pageSize,
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
            this.companies = res.data.content;
            this.totalCompanies = res.data.totalElements;
            this.getTitleTable();
          }
          this.cdr.detectChanges();
        },
        error: (err) => this.handlerError(err),
      });

    this.reload$.next();
  }

  override ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
  }

  filterClean(): void {
    this.filterForm.reset();
    this.reload$.next();
  }

  newRequest(): void {
    this.router.navigate(['/pages/companies/create'], {
      relativeTo: this.activatedRoute,
    });
  }

  getLabelSituacao(status: any): string {
    return status ?? 'Status desconhecido';
  }

  getStateSituacao(status: any): DsExtendedState {
    if (status === 'ATIVO') return DsExtendedState.success;
    if (status === 'INATIVO') return DsExtendedState.error;
    return DsExtendedState.default;
  }

  onPageChanged(event: DsPageState): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.reload$.next();
  }

  search(company: CompanyResponse) {
    this.router.navigate([`/pages/companies/search/${company.id}/disable`], {
      relativeTo: this.activatedRoute,
    });
  }

  active(company: CompanyResponse) {
    this.companyService.activate(company.id).subscribe({
      next: () => {
        this.pageIndex = 1;
        this.reload$.next();
      },
      error: (err) => {
        console.error('Erro ao ativar empresa', err);
      },
    });
  }

  update(company: CompanyResponse) {
    this.router.navigate([`/pages/companies/edit/${company.id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  delete(company: CompanyResponse) {
    this.companyService.delete(company.id).subscribe({
      next: () => {
        this.pageIndex = 1;
        this.reload$.next();
      },
      error: (err) => {
        console.error('Erro ao deletar empresa', err);
      },
    });
  }

  private getTitleTable(): void {
    const qtd = this.totalCompanies;
    this.titleTable =
      qtd > 1 ? `Existem ${qtd} empresas cadastradas!` : `Existe ${qtd} empresa cadastrada!`;
  }

  private handlerError(error: any): void {
    const message = error?.error?.message ?? error?.message ?? 'Ocorreu um erro inesperado';
    this.toastrService.error(message, 'Erro!', {
      positionClass: 'toast-top-right',
    });
  }

  protected readonly dsInputIconAlign = DsInputIconAlign;
}
