export interface LoggedUser {
  token_type: string;
  token: string;
  name: string;
  document: string;
  email: string;
  company: string;
  profile: string;
  permissions: string[];
}
