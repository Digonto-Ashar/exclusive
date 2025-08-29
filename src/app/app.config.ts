import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    // This is the correct and simplest way to add reactive forms
    importProvidersFrom(ReactiveFormsModule, NgxSkeletonLoaderModule) 
  ]
};