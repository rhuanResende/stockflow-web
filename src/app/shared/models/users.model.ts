import { CompanyResponse } from './company.model';

export interface UserResponse {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  company: CompanyResponse;
  profile: string;
  status: string;
  firstAccess: boolean;
  forcePasswordChange: boolean;
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
