import { Component, Injector, OnInit } from '@angular/core';
import {
  DsButtonIconAlign,
  DsButtonSize,
  DsButtonType,
  DsComponent, isNotEmpty,
} from '@rhuanResende/design-system';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserAuthenticatedService } from '../../../../shared/services/user-authenticated.service';
import { CompanyService } from '../../../../shared/services/company.service';
import { CompanyResponse } from '../../../../shared/models/company.model';
import { ProductService } from '../../../../shared/services/product.service';
import {
  ProductCreate,
  ProductUpdate,
  UnitResponse,
} from '../../../../shared/models/product.model';

@Component({
  standalone: false,
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent extends DsComponent implements OnInit {
  profile!: string;

  productForm!: FormGroup;
  productId: string | null = null;
  disabled = false;

  companies: CompanyResponse[] = [];
  units: UnitResponse[] = [];

  protected readonly dsButtonSize = DsButtonSize;
  protected readonly dsButtonIconAlign = DsButtonIconAlign;
  protected readonly dsButtonType = DsButtonType;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly companyService: CompanyService,
    private readonly toastrService: ToastrService,
    private readonly userAuthenticatedService: UserAuthenticatedService,
  ) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.productId = this.activatedRoute.snapshot.params['id'];
    this.disabled = !!this.activatedRoute.snapshot.params['state'];

    this.profile = this.userAuthenticatedService.getUser().profile;

    this.getCompanies();
    this.getUnits();

    this.initForm();

    if (this.productId) {
      this.getProduct();
    }
  }

  clean(): void {
    this.productForm.reset();
  }

  create(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (isNotEmpty(this.productForm.get('id')?.value)) {
      this.productService.update(this.buildBodyUpdate()).subscribe({
        next: (res) => {
          if (res.success) {
            this.handlerSuccess(res.message);
            this.goToBack();
          }
        },
        error: err => this.handlerError(err)
      });
    } else {
      this.productService.create(this.buildBodyCreate()).subscribe({
        next: (res) => {
          if (res.success) {
            this.handlerSuccess(res.message);
            this.goToBack();
          }
        },
        error: (err) => this.handlerError(err),
      });
    }
  }

  goToBack(): void {
    this.router.navigate(['/pages/products/list'], {
      relativeTo: this.activatedRoute,
    });
  }

  private getCompanies(): void {
    this.companyService.search().subscribe({
      next: (res) => {
        if (res.success) {
          this.companies = res.data;
        }
      },
      error: (err) => {
        this.handlerError(err);
      },
    });
  }

  private getUnits(): void {
    this.productService.getUnits().subscribe({
      next: (res) => {
        if (res.success) {
          this.units = res.data;
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: [''],
      companyId: [{ value: '', disabled: this.disabled }],
      name: [{ value: '', disabled: this.disabled }, [Validators.required]],
      description: [{ value: '', disabled: this.disabled }],
      sku: [{ value: '', disabled: this.disabled }],
      barcode: [{ value: '', disabled: this.disabled }],
      unit: [{ value: '', disabled: this.disabled }, [Validators.required]],
      minimumStock: [{ value: '', disabled: this.disabled }, [Validators.required]],
      profit: [{ value: '', disabled: this.disabled }],
    });
  }

  private getProduct(): void {
    if (!this.productId) return;
    this.productService.findById(this.productId).subscribe({
      next: (res) => {
        if (res.success) {
          this.productForm.patchValue({
            id: res.data.id,
            companyId: this.companies.find((c) => c.id === res.data.company.id)?.id,
            name: res.data.name,
            description: res.data.description,
            sku: res.data.sku,
            barcode: res.data.barcode,
            unit: this.units.find((u) => u.value === res.data.unit)?.id,
            minimumStock: res.data.minimumStock,
            profit: res.data.profit,
          });
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private buildBodyCreate(): ProductCreate {
    const { companyId, name, description, sku, barcode, unit, minimumStock, profit } =
      this.productForm.getRawValue();
    return {
      companyId,
      name,
      description,
      sku,
      barcode,
      unit,
      minimumStock,
      profit,
    };
  }

  private buildBodyUpdate(): ProductUpdate {
    const { id, companyId, name, description, sku, barcode, unit, minimumStock, profit } =
      this.productForm.getRawValue();
    return {
      id,
      companyId,
      name,
      description,
      sku,
      barcode,
      unit,
      minimumStock,
      profit,
    };
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
}
