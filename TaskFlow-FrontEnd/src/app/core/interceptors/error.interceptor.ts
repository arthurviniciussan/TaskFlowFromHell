import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { TokenService } from '../services/token.service';

function resolveErrorMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }
  if (error.error?.message) {
    return error.error.message;
  }

  switch (error.status) {
    case 0:
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    case 400:
      return 'Requisição inválida. Verifique os dados enviados.';
    case 401:
      return 'Credenciais inválidas ou sessão expirada.';
    case 403:
      return 'Você não tem permissão para esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const notification = inject(NotificationService);
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRoute) {
        tokenService.clear();
        router.navigate(['/login']);
      } else if (!isAuthRoute || error.status !== 401) {
        notification.error(resolveErrorMessage(error));
      }

      return throwError(() => error);
    }),
  );
};
