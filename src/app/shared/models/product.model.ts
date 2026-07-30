import { CompanyResponse } from './company.model';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  purchasePrice: number;
  profit: number;
  salePrice: number;
  status: string;
  company: CompanyResponse;
}

export interface ProductCreate {
  companyId: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  unit: string;
  minimumStock: string;
  profit: string;
}

export interface ProductUpdate {
  id: string;
  companyId: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  unit: string;
  minimumStock: string;
  profit: string;
}

export interface UnitResponse {
  id: string;
  value: string;
}
