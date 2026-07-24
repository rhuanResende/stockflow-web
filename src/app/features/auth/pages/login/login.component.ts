import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DsComponent, DsDocumentType, DsInputIconAlign } from '@rhuanResende/design-system';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends DsComponent {
  loginForm: FormGroup;

  dsDocumentType: typeof DsDocumentType = DsDocumentType;

  constructor(
    injector: Injector,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService,
  ) {
    super(injector);
    this.loginForm = this.fb.group({
      document: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.data.firstAccess) {
            this.router.navigate(['/pages/change-password']);
            return;
          }
          this.getUser();
        }
      },
      error: (err) => this.handlerError(err),
    });
  }

  private getUser(): void {
    this.authService.getMe().subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/pages/home']);
          return;
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

  protected readonly dsInputIconAlign = DsInputIconAlign;
}
