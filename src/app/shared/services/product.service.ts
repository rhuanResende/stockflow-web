import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Environment } from '../../core/models/environment';
import { isNotEmpty } from '@rhuanResende/design-system';
import { Page } from '../../core/models/pageable.model';
import {
  ProductCreate,
  ProductResponse,
  ProductUpdate,
  UnitResponse,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url;

  constructor(
    private http: HttpClient,
    @Inject('ENVIRONMENT') private environment: Environment,
  ) {
    this.url = this.environment.baseUrl + '/product';
  }

  findAll(
    pageIndex: number,
    pageSize: number,
    companyId?: string,
    name?: string,
    sku?: string,
    barcode?: string,
    status?: string,
  ): Observable<ApiResponse<Page<ProductResponse>>> {
    let url = `${this.url}?page=${pageIndex}&size=${pageSize}`;
    if (isNotEmpty(companyId)) {
      url += `&companyId=${companyId}`;
    }
    if (isNotEmpty(name)) {
      url += `&name=${name}`;
    }
    if (isNotEmpty(sku)) {
      url += `&sku=${sku}`;
    }
    if (isNotEmpty(barcode)) {
      url += `&barcode=${barcode}`;
    }
    if (isNotEmpty(status)) {
      url += `&status=${status}`;
    }
    return this.http.get<ApiResponse<Page<ProductResponse>>>(`${url}`);
  }

  getUnits(): Observable<ApiResponse<UnitResponse[]>> {
    const url = `${this.url}/units`;
    return this.http.get<ApiResponse<UnitResponse[]>>(url);
  }

  findById(id: string): Observable<ApiResponse<ProductResponse>> {
    const url = `${this.url}/${id}`;
    return this.http.get<ApiResponse<ProductResponse>>(url);
  }

  create(body: ProductCreate): Observable<ApiResponse<ProductResponse>> {
    const url = `${this.url}`;
    return this.http.post<ApiResponse<ProductResponse>>(`${url}`, body);
  }

  update(body: ProductUpdate): Observable<ApiResponse<ProductResponse>> {
    const url = `${this.url}`;
    return this.http.put<ApiResponse<ProductResponse>>(`${url}`, body);
  }

  delete(id: string) {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  activate(id: string) {
    const url = `${this.url}/activate/${id}`;
    return this.http.put(url, null);
  }
}
