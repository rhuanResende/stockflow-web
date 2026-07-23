import { Component, Injector, OnInit } from '@angular/core';
import {
  DsButtonIconAlign,
  DsButtonSize,
  DsButtonType,
  DsComponent,
  DsDocumentType,
  DsInputIconAlign,
  DsValidators,
  isNotEmpty,
} from '@rhuanResende/design-system';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../shared/services/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss'],
})
export class CompanyCreateComponent extends DsComponent implements OnInit {
  companyForm!: FormGroup;
  companyId: string | null = null;
  disabled = false;

  protected readonly dsDocumentType: typeof DsDocumentType = DsDocumentType;
  protected readonly dsButtonType: typeof DsButtonType = DsButtonType;
  protected readonly dsButtonIconAlign: typeof DsButtonIconAlign = DsButtonIconAlign;
  protected readonly dsButtonSize: typeof DsButtonSize = DsButtonSize;
  protected readonly dsInputIconAlign: typeof DsInputIconAlign = DsInputIconAlign;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly companyService: CompanyService,
    private readonly toastrService: ToastrService,
  ) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.companyId = this.activatedRoute.snapshot.params['id'];
    this.disabled = !!this.activatedRoute.snapshot.params['state'];

    this.initForm();

    if (this.companyId) {
      this.getCompany();
    }
  }

  clean(): void {
    this.companyForm.reset();
  }

  create(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    if (isNotEmpty(this.companyForm.get('id')?.value)) {
      this.companyService.update(this.buildBodyUpdate()).subscribe({
        next: (res) => {
          if (res.success) {
            this.handlerSuccess(res.message);
            this.goToBack();
          }
        },
        error: (err) => {
          this.handlerError(err);
        },
      });
    } else {
      this.companyService.create(this.buildBodyCreate()).subscribe({
        next: (res) => {
          if (res.success) {
            this.handlerSuccess(res.message);
            this.goToBack();
          }
        },
        error: (err) => {
          this.handlerError(err);
        },
      });
    }
  }

  goToBack(): void {
    this.router.navigate(['/pages/companies/list'], {
      relativeTo: this.activatedRoute,
    });
  }

  private initForm(): void {
    this.companyForm = this.fb.group({
      id: [''],
      name: [
        { value: '', disabled: this.disabled },
        [Validators.required, Validators.maxLength(100)],
      ],
      document: [{ value: '', disabled: this.disabled }, [Validators.required]],
      email: [{ value: '', disabled: this.disabled }, [Validators.required, DsValidators.email]],
      phone: [{ value: '', disabled: this.disabled }, [Validators.required]],
    });
  }

  private getCompany(): void {
    if (!this.companyId) return;
    this.companyService.findById(this.companyId).subscribe({
      next: (res) => {
        if (res.success) {
          this.companyForm.patchValue({
            id: res.data.id,
            name: res.data.name,
            document: res.data.document,
            email: res.data.email,
            phone: res.data.phone,
          });
        }
      },
      error: (err) => {
        this.handlerError(err);
      },
    });
  }

  private buildBodyCreate() {
    const { name, document, email, phone } = this.companyForm.getRawValue();
    return {
      name,
      document,
      email,
      phone
    };
  }

  private buildBodyUpdate() {
    const { id, name, document, email, phone } = this.companyForm.getRawValue();
    return {
      id,
      name,
      document,
      email,
      phone
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
