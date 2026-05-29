import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants/api.constants';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, request)
      .pipe(tap((response) => this.persistAuth(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, request)
      .pipe(tap((response) => this.persistAuth(response)));
  }

  logout(): void {
    this.tokenService.clear();
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }

  getUsername(): string | null {
    return this.tokenService.getUsername();
  }

  private persistAuth(response: AuthResponse): void {
    this.tokenService.setToken(response.token);
    this.tokenService.setUsername(response.username);
  }
}
