import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const ICON_HOST_STYLES = `
  :host {
    display: inline-flex;
    width: var(--ss-icon-size, 24px);
    height: var(--ss-icon-size, 24px);
    color: currentColor;
  }
  svg { width: 100%; height: 100%; display: block; }
`;

@Component({
  selector: 'ss-cart-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" [attr.aria-label]="ariaLabel || null" [attr.aria-hidden]="ariaLabel ? null : true">
      <path d="M3.5 4h2l1.4 11.2A2 2 0 0 0 8.88 17h8.74a2 2 0 0 0 1.98-1.7l1.15-7.3H7"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="10" cy="20" r="1.25" fill="currentColor" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" />
    </svg>
  `,
  styles: [ICON_HOST_STYLES],
})
export class SsCartIcon {
  @Input() ariaLabel?: string;
}

@Component({
  selector: 'ss-account-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" [attr.aria-label]="ariaLabel || null" [attr.aria-hidden]="ariaLabel ? null : true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5" />
      <path d="M4.5 20c.8-3.5 4-5.5 7.5-5.5s6.7 2 7.5 5.5"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  `,
  styles: [ICON_HOST_STYLES],
})
export class SsAccountIcon {
  @Input() ariaLabel?: string;
}

@Component({
  selector: 'ss-plus-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
    </svg>
  `,
  styles: [ICON_HOST_STYLES],
})
export class SsPlusIcon {}

@Component({
  selector: 'ss-minus-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
    </svg>
  `,
  styles: [ICON_HOST_STYLES],
})
export class SsMinusIcon {}

@Component({
  selector: 'ss-x-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  `,
  styles: [ICON_HOST_STYLES],
})
export class SsXIcon {}

@Component({
  selector: 'ss-chevron-down-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
  styles: [ICON_HOST_STYLES],
})
export class SsChevronDownIcon {}
