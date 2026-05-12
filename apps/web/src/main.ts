import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component.js';
import { appConfig } from './app/app.config.js';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  // bootstrap failure must surface immediately

  console.error(err);
});
