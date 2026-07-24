import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../core/models/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Page } from '../../core/models/pageable.model';
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../models/users.model';
import { isNotEmpty } from '@rhuanResende/design-system';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url;

  constructor(
    private http: HttpClient,
    @Inject('ENVIRONMENT') private environment: Environment,
  ) {
    this.url = this.environment.baseUrl + '/user';
  }

  findAll(
    pageIndex: number,
    pageSize: number,
    companyId: string,
    profileId: string,
    name?: string,
    document?: string,
    status?: string,
  ): Observable<ApiResponse<Page<UserResponse>>> {
    let url = `${this.url}?page=${pageIndex}&size=${pageSize}`;
    if (isNotEmpty(companyId)) {
      url += `&companyId=${companyId}`;
    }
    if (isNotEmpty(profileId)) {
      url += `&profileId=${profileId}`;
    }
    if (isNotEmpty(name)) {
      url += `&name=${name}`;
    }
    if (isNotEmpty(document)) {
      url += `&document=${document}`;
    }
    if (isNotEmpty(status)) {
      url += `&status=${status}`;
    }
    return this.http.get<ApiResponse<Page<UserResponse>>>(`${url}`);
  }

  findById(id: string): Observable<ApiResponse<UserResponse>> {
    const url = `${this.url}/${id}`;
    return this.http.get<ApiResponse<UserResponse>>(url);
  }

  create(body: UserCreateRequest): Observable<ApiResponse<UserResponse>> {
    const url = `${this.url}`;
    return this.http.post<ApiResponse<UserResponse>>(`${url}`, body);
  }

  update(body: UserUpdateRequest): Observable<ApiResponse<UserResponse>> {
    const url = `${this.url}`;
    return this.http.put<ApiResponse<UserResponse>>(`${url}`, body);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const url = `${this.url}/${id}`;
    return this.http.delete<ApiResponse<void>>(url);
  }

  activate(id: string): Observable<ApiResponse<void>> {
    const url = `${this.url}/activate/${id}`;
    return this.http.put<ApiResponse<void>>(url, null);
  }
}
