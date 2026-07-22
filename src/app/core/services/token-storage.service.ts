import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly TOKEN_TYPE_KEY = 'stockflow_token_type';
  private readonly TOKEN_KEY = 'stockflow_token';
  private readonly USER_KEY = 'stockflow_user';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  saveTokenType(tokenType: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_TYPE_KEY, tokenType);
    }
  }

  getTokenType(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveUser(user: any): void {
    if (this.isBrowser()) {
      const { token_type, token, ...userWithoutSensitiveData } = user;
      const userData = JSON.stringify(userWithoutSensitiveData);
      localStorage.setItem(this.USER_KEY, userData);
    }
  }

  getUser(): any {
    if (!this.isBrowser()) return null;

    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  clear(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getMustChangePassword(): boolean {
    return this.getUser().mustChangePassword;
  }
}
