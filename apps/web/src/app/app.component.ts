import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './core/layout/top-nav.component.js';
import { AppFooterComponent } from './core/layout/app-footer.component.js';

@Component({
  selector: 'ss-app',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TopNavComponent, AppFooterComponent],
  template: `
    <ss-top-nav />
    <main class="ss-main">
      <router-outlet />
    </main>
    <ss-app-footer />
  `,
  styles: [
    `
      :host { display: flex; flex-direction: column; min-height: 100vh; }
      .ss-main { flex: 1; display: flex; flex-direction: column; }
    `,
  ],
})
export class AppComponent {}
