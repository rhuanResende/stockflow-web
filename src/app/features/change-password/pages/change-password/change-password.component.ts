import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { DsComponent, DsInputIconAlign } from '@rhuanResende/design-system';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { Subject } from 'rxjs';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password.validator';

@Component({
  standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent extends DsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  passwordForm!: FormGroup;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly toastrService: ToastrService,
  ) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  override ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnInit();
  }

  changePassword(): void {
    this.authService.changeInitialPassword(this.buildBody()).subscribe({
      next: (res) => {
        if (res.success) {
          this.tokenStorageService.clear();
          this.toastrService.success(res.message, 'Sucesso!', {
            positionClass: 'toast-top-right',
          });
          this.router.navigate(['/pages/login']);
          return;
        }
      },
      error: (err) => this.handlerError(err)
    });
  }

  private initForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: [null, [Validators.required]],
        newPassword: [null, [Validators.required, passwordValidator()]],
        confirmPassword: [null, [Validators.required]],
      },
      {
        validators: confirmPasswordValidator(),
      },
    );
  }

  private buildBody() {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      return null;
    }

    return {
      currentPassword,
      newPassword,
      confirmPassword,
    };
  }

  private handlerError(error: any): void {
    const message = error?.error?.message ?? error?.message ?? 'Ocorreu um erro inesperado';
    this.toastrService.error(message, 'Erro!', {
      positionClass: 'toast-top-right',
    });
  }

  protected readonly dsInputIconAlign = DsInputIconAlign;
}

