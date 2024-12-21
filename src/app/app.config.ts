import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DbService } from "./db.service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), DbService,
    {
      provide: APP_INITIALIZER,
      useFactory: (dbService: DbService) => () => dbService.init(),
      deps: [DbService],
      multi: true, // nécessaire pour APP_INITIALIZER
    },],
};
