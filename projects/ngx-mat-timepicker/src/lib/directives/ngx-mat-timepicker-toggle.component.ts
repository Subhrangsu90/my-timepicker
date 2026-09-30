import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatTimepicker } from '../ngx-mat-timepicker';

@Component({
  selector: 'ngx-mat-timepicker-toggle',
  exportAs: 'ngxMatTimepickerToggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="timepicker-toggle-button"
      [disabled]="disabled() || picker().disabled()"
      (click)="onClick($event)"
      aria-label="Open time picker"
    >
      <svg class="toggle-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
        />
      </svg>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      box-sizing: border-box;
    }

    .timepicker-toggle-button {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: var(--mat-form-field-icon-color, var(--ngx-mat-tp-action-icon, #49454f));
      cursor: pointer;
      outline: none;
      padding: 0;
      transition: background-color 150ms ease, color 150ms ease;

      &:hover:not([disabled]) {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, #6750a4);
      }

      &[disabled] {
        opacity: 0.38;
        cursor: default;
      }
    }

    .toggle-svg {
      width: 24px;
      height: 24px;
    }
  `,
})
export class NgxMatTimepickerToggleComponent {
  readonly picker = input.required<NgxMatTimepicker>({ alias: 'for' });
  readonly disabled = input<boolean>(false);

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.picker().open();
  }
}
