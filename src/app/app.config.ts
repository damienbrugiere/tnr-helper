import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from "./app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DbService } from "./db.service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), DbService, provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: (dbService: DbService) => () => dbService.init(),
      deps: [DbService],
      multi: true, // nécessaire pour APP_INITIALIZER
    },]
};
