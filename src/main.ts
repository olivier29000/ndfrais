import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
registerLocaleData(localeFr);
