import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Environment } from '../../core/models/environment';
import { isNotEmpty } from '@rhuanResende/design-system';
import { Page } from '../../core/models/pageable.model';
import {
  CompanyCreateRequest,
  CompanyResponse,
  CompanyUpdateRequest,
} from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private url;

  constructor(
    private http: HttpClient,
    @Inject('ENVIRONMENT') private environment: Environment,
  ) {
    this.url = this.environment.baseUrl + '/company';
  }

  findAll(
    pageIndex: number,
    pageSize: number,
    name?: string,
    document?: string,
    status?: string,
  ): Observable<ApiResponse<Page<CompanyResponse>>> {
    let url = `${this.url}?page=${pageIndex}&size=${pageSize}`;
    if (isNotEmpty(name)) {
      url += `&name=${name}`;
    }
    if (isNotEmpty(document)) {
      url += `&document=${document}`;
    }
    if (isNotEmpty(status)) {
      url += `&status=${status}`;
    }
    return this.http.get<ApiResponse<Page<CompanyResponse>>>(`${url}`);
  }

  findById(id: string): Observable<ApiResponse<CompanyResponse>> {
    const url = `${this.url}/${id}`;
    return this.http.get<ApiResponse<CompanyResponse>>(url);
  }

  create(body: CompanyCreateRequest): Observable<ApiResponse<CompanyResponse>> {
    const url = `${this.url}`;
    return this.http.post<ApiResponse<CompanyResponse>>(`${url}`, body);
  }

  update(body: CompanyUpdateRequest): Observable<ApiResponse<CompanyResponse>> {
    const url = `${this.url}`;
    return this.http.put<ApiResponse<CompanyResponse>>(`${url}`, body);
  }

  delete(id: string) {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  activate(id: string) {
    const url = `${this.url}/activate/${id}`;
    return this.http.put(url, null);
  }

  search(filter?: string): Observable<ApiResponse<CompanyResponse[]>> {
    let url = `${this.url}/search`;
    if (isNotEmpty(filter)) {
      url += `?filter=${filter}`;
    }
    return this.http.get<ApiResponse<CompanyResponse[]>>(url);
  }
}
