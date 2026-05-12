import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { type ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes.js';
import { authInterceptor } from './core/http/auth.interceptor.js';
import { errorInterceptor } from './core/http/error.interceptor.js';
import { requestIdInterceptor } from './core/http/request-id.interceptor.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([requestIdInterceptor, authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
  ],
};
