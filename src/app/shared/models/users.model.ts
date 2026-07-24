import { CompanyResponse } from './company.model';

export interface UserResponse {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  company: CompanyResponse;
  profile: string;
}

export interface UserCreateRequest {
  companyId: string;
  profileId: string;
  name: string;
  document: string;
  email: string;
  phone: string;
}

export interface UserUpdateRequest {
  id: string;
  companyId: string;
  profileId: string;
  name: string;
  document: string;
  email: string;
  phone: string;
}
