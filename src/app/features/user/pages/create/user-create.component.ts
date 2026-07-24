import { Component, Injector, OnInit } from '@angular/core';
import {
  DsButtonIconAlign,
  DsButtonSize,
  DsButtonType,
  DsCardBaseCollapsibleState,
  DsComponent,
  DsDocumentType,
  DsInputIconAlign,
  DsValidators,
  isNotEmpty,
} from '@rhuanResende/design-system';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../shared/services/user.service';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { CompanyService } from '../../../../shared/services/company.service';
import { CompanyResponse } from '../../../../shared/models/company.model';
import { RoleResponse } from '../../../../shared/models/auth.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserAuthenticatedService } from '../../../../shared/services/user-authenticated.service';
import { UserCreateRequest, UserUpdateRequest } from '../../../../shared/models/users.model';

@Component({
  standalone: false,
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent extends DsComponent implements OnInit {
  profile!: string;

  userForm!: FormGroup;
  userId: string | null = null;
  disabled = false;

  companies: CompanyResponse[] = [];
  profiles: RoleResponse[] = [];

  protected readonly dsDocumentType: typeof DsDocumentType = DsDocumentType;
  protected readonly dsButtonType: typeof DsButtonType = DsButtonType;
  protected readonly dsButtonIconAlign: typeof DsButtonIconAlign = DsButtonIconAlign;
  protected readonly dsButtonSize: typeof DsButtonSize = DsButtonSize;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService,
    private readonly userAuthenticatedService: UserAuthenticatedService,
  ) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.userId = this.activatedRoute.snapshot.params['id'];
    this.disabled = !!this.activatedRoute.snapshot.params['state'];

    this.profile = this.userAuthenticatedService.getUser().profile;

    this.getCompanies();
    this.getProfiles();

    this.initForm();

    if (this.userId) {
      this.getUser();
    }
  }

  clean(): void {
    this.userForm.reset();
  }

  create(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (isNotEmpty(this.userForm.get('id')?.value)) {
      this.userService.update(this.buildBodyUpdate()).subscribe({
        next: (res) => {
          if (res.success) {
            this.handlerSuccess(res.message);
            this.goToBack();
          }
        },
        error: (err) => this.handlerError(err),
      });
      //Update
    } else {
      this.userService.create(this.buildBodyCreate()).subscribe({
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
    this.router.navigate(['/pages/users/list'], {
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

  private getProfiles(): void {
    this.authService.getRoles().subscribe({
      next: (res) => {
        if (res.success) {
          this.profiles = res.data;
        }
      },
      error: (err) => {
        this.handlerError(err);
      },
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      id: [''],
      companyId: [{ value: '', disabled: this.disabled }],
      profileId: [{ value: '', disabled: this.disabled }, [Validators.required]],
      name: [{ value: '', disabled: this.disabled }, [Validators.required]],
      document: [{ value: '', disabled: this.disabled }, [Validators.required]],
      email: [{ value: '', disabled: this.disabled }, [Validators.required, DsValidators.email]],
      phone: [{ value: '', disabled: this.disabled }, [Validators.required]],
    });
  }

  private getUser(): void {
    if (!this.userId) return;
    this.userService.findById(this.userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.userForm.patchValue({
            id: res.data.id,
            companyId: this.companies.find((c) => c.id === res.data.company.id)?.id,
            profileId: this.profiles.find((p) => p.name === res.data.profile)?.id,
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

  private buildBodyCreate(): UserCreateRequest {
    const { companyId, profileId, name, document, email, phone } = this.userForm.getRawValue();
    return {
      companyId,
      profileId,
      name,
      document,
      email,
      phone,
    };
  }

  private buildBodyUpdate(): UserUpdateRequest {
    const { id, companyId, profileId, name, document, email, phone } = this.userForm.getRawValue();
    return {
      id,
      companyId,
      profileId,
      name,
      document,
      email,
      phone,
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

  protected readonly dsInputIconAlign = DsInputIconAlign;
}
