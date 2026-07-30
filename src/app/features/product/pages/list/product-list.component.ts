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
  DsPageState,
} from '@rhuanResende/design-system';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyResponse } from '../../../../shared/models/company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../shared/services/company.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../shared/services/product.service';
import { ProductResponse } from '../../../../shared/models/product.model';
import { UserAuthenticatedService } from '../../../../shared/services/user-authenticated.service';

@Component({
  standalone: false,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent extends DsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private reload$ = new Subject<void>();

  filterForm!: FormGroup;
  products: any[] = [];
  totalProducts: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  titleTable!: string;
  profile!: string;
  userCompany!: CompanyResponse;

  companies: CompanyResponse[] = [];

  masterColumns: Array<DsColumn> = new Array<DsColumn>(
    { name: 'name', title: 'Nome', type: DsColumnType.text },
    { name: 'companyName', title: 'Empresa', type: DsColumnType.text },
    { name: 'currentStock', title: 'Qtd. Estoque', type: DsColumnType.text },
    { name: 'salePrice', title: 'Preço de venda', type: DsColumnType.currency },
    { name: 'status', title: 'Situação', type: DsColumnType.text },
    { name: 'actions', title: '' },
  );

  userColumns: Array<DsColumn> = new Array<DsColumn>(
    { name: 'name', title: 'Nome', type: DsColumnType.text },
    { name: 'currentStock', title: 'Qtd. Estoque', type: DsColumnType.text },
    { name: 'salePrice', title: 'Preço de venda', type: DsColumnType.currency },
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
    private readonly productService: ProductService,
    private readonly companyService: CompanyService,
    private readonly userAuthenticatedService: UserAuthenticatedService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastrService: ToastrService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.profile = this.userAuthenticatedService.getUser().profile;
    this.userCompany = this.userAuthenticatedService.getUser().company;

    this.getCompanies();

    this.initForm();

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
          this.productService.findAll(
            this.pageIndex - 1,
            this.pageSize,
            this.filterForm.get('company')?.value,
            this.filterForm.get('name')?.value,
            this.filterForm.get('sku')?.value,
            this.filterForm.get('barcode')?.value,
            this.filterForm.get('status')?.value,
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.products = res.data.content.map((product) => ({
              ...product,
              companyName: product.company?.name,
            }));
            this.totalProducts = res.data.totalElements;
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
    this.filterForm.patchValue({
      company: this.userCompany.id,
    });
    this.reload$.next();
  }

  newRequest(): void {
    this.router.navigate(['/pages/products/create'], {
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

  search(product: ProductResponse) {
    this.router.navigate([`/pages/products/search/${product.id}/disable`], {
      relativeTo: this.activatedRoute,
    });
  }

  active(product: ProductResponse) {
    this.productService.activate(product.id).subscribe({
      next: () => {
        this.pageIndex = 1;
        this.reload$.next();
      },
      error: (err) => this.handlerError(err),
    });
  }

  update(product: ProductResponse) {
    this.router.navigate([`/pages/products/edit/${product.id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  delete(product: ProductResponse) {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.pageIndex = 1;
        this.reload$.next();
      },
      error: (err) => this.handlerError(err),
    });
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      company: [this.userCompany.id],
      name: [null],
      sku: [null],
      barcode: [null],
      status: [null],
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

  private getTitleTable(): void {
    const qtd = this.totalProducts;
    this.titleTable =
      qtd > 1 ? `Existem ${qtd} produtos cadastrados!` : `Existe ${qtd} produto cadastrado!!`;
  }

  private handlerError(error: any): void {
    const message = error?.error?.message ?? error?.message ?? 'Ocorreu um erro inesperado';
    this.toastrService.error(message, 'Erro!', {
      positionClass: 'toast-top-right',
    });
  }
}
