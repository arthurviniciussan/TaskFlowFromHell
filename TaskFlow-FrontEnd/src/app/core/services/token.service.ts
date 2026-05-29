import { Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY, USERNAME_STORAGE_KEY } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  getUsername(): string | null {
    return localStorage.getItem(USERNAME_STORAGE_KEY);
  }

  setUsername(username: string): void {
    localStorage.setItem(USERNAME_STORAGE_KEY, username);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  clear(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
  }
}
