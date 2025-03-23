import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { importProvidersFrom } from '@angular/core';

const config = {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule)
  ]
};

bootstrapApplication(AppComponent, config)
  .catch((err) => console.error(err));
