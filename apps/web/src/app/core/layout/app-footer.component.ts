import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ss-app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="ss-footer" role="contentinfo">
      <div class="ss-footer__columns">
        <section>
          <h2 class="ss-footer__heading">Shop</h2>
          <ul><li><a>All products</a></li><li><a>Home</a></li><li><a>Apparel</a></li><li><a>Electronics</a></li></ul>
        </section>
        <section>
          <h2 class="ss-footer__heading">Help</h2>
          <ul><li><a>Contact</a></li><li><a>Returns</a></li><li><a>Shipping</a></li><li><a>FAQ</a></li></ul>
        </section>
        <section>
          <h2 class="ss-footer__heading">Company</h2>
          <ul><li><a>About</a></li><li><a>Careers</a></li><li><a>Press</a></li></ul>
        </section>
        <section>
          <h2 class="ss-footer__heading">Legal</h2>
          <ul><li><a>Privacy</a></li><li><a>Terms</a></li><li><a>Cookies</a></li></ul>
        </section>
      </div>
      <div class="ss-footer__legal">
        <span>© 2026 ShopStream, Inc.</span>
        <span>United States · USD</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .ss-footer {
        background: var(--color-canvas);
        border-top: 1px solid var(--color-hairline);
        padding: 48px 24px 56px;
      }
      .ss-footer__columns {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
      .ss-footer__heading { font-size: 14px; font-weight: 600; line-height: 1.3; color: var(--color-ink); margin: 0 0 12px; }
      .ss-footer__columns ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
      .ss-footer__columns a { font-size: 14px; color: var(--color-ink); text-decoration: none; cursor: pointer; }
      .ss-footer__columns a:hover { text-decoration: underline; text-underline-offset: 2px; }
      .ss-footer__legal {
        max-width: 1200px;
        margin: 32px auto 0;
        display: flex;
        justify-content: space-between;
        gap: 16px;
        font-size: 12px;
        color: var(--color-muted);
      }

      @media (max-width: 1024px) {
        .ss-footer__columns { grid-template-columns: repeat(2, 1fr); }
      }
    `,
  ],
})
export class AppFooterComponent {}
