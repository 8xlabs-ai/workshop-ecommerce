import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ss-app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ss-app-shell">
      <ng-content select="[slot=nav]" />
      <main class="ss-app-shell__main">
        <ng-content />
      </main>
      <ng-content select="[slot=footer]" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ss-app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--color-canvas);
      }
      .ss-app-shell__main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class AppShellComponent {}
