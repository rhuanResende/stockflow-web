import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'stockflow_token';
  private readonly REFRESH_TOKEN_KEY = 'stockflow_refresh_token';
  private readonly LOGIN_DATA_KEY = 'stockflow_data';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
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

  saveRefreshToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  saveLoginData(data: any): void {
    if (this.isBrowser()) {
      const userData = JSON.stringify(data);
      localStorage.setItem(this.LOGIN_DATA_KEY, userData);
    }
  }

  getLoginData() {
    if (!this.isBrowser()) return null;
    const data = localStorage.getItem(this.LOGIN_DATA_KEY);
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

  isFirstAccess(): boolean {
    return true;
  }
}
