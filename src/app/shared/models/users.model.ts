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
