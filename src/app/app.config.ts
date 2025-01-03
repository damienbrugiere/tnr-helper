import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from "./app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DbService } from "./db.service";
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), DbService, provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (dbService: DbService) => () => dbService.init(),
      deps: [DbService],
      multi: true, // nécessaire pour APP_INITIALIZER
    }, provideCharts(withDefaultRegisterables()),
     provideCharts(withDefaultRegisterables())
  ]
};
