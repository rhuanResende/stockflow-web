import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Environment } from '../../core/models/environment';
import { ApiResponse } from '../../core/models/api-response.model';
import { LoginRequest, NewPasswordRequest, RoleResponse } from '../models/auth.model';
import { UserResponse } from '../models/users.model';
import { UserAuthenticatedService } from './user-authenticated.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlAuth;

  constructor(
    private http: HttpClient,
    @Inject('ENVIRONMENT') private environment: Environment,
    private usuarioAutenticado: UserAuthenticatedService,
  ) {
    this.urlAuth = this.environment.baseUrl + '/auth';
  }

  login(request: LoginRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.urlAuth}/login`, request);
  }

  refreshToken(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.urlAuth}/refresh`, null);
  }

  getMe(): Observable<ApiResponse<UserResponse>> {
    const url = `${this.urlAuth}/me`;
    return this.http.get<ApiResponse<UserResponse>>(url).pipe(
      tap((response) => {
        if (response.success) {
          this.usuarioAutenticado.setUser(response.data);
        }
      }),
    );
  }

  changeInitialPassword(request: NewPasswordRequest): Observable<ApiResponse<void>> {
    const url = `${this.urlAuth}/change-initial-password`;
    return this.http.post<ApiResponse<void>>(url, request);
  }

  logout(): Observable<ApiResponse<void>> {
    const url = `${this.urlAuth}/logout`;
    return this.http.post<ApiResponse<void>>(url, null);
  }

  getRoles(): Observable<ApiResponse<RoleResponse[]>> {
    const url = `${this.urlAuth}/findRoles`;
    return this.http.get<ApiResponse<RoleResponse[]>>(url);
  }
}
