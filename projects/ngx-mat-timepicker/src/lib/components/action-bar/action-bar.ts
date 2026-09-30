import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePickerMode } from '../../models/timepicker.model';

@Component({
  selector: 'ngx-mat-action-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="action-bar-container">
      <!-- Mode Toggle Button (Keyboard / Clock) -->
      <button
        type="button"
        class="icon-button"
        (click)="onToggleMode()"
        [attr.aria-label]="
          mode() === 'dial' ? 'Switch to text input mode' : 'Switch to clock dial mode'
        "
      >
        @if (mode() === 'dial') {
          <!-- Keyboard Icon -->
          <svg class="action-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"
            />
          </svg>
        } @else {
          <!-- Clock / Schedule Icon -->
          <svg class="action-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
            />
          </svg>
        }
      </button>

      <!-- Action Buttons (Cancel / OK) -->
      <div class="buttons-group">
        <button type="button" class="text-button" (click)="cancel.emit()">
          {{ cancelLabel() }}
        </button>
        <button type="button" class="text-button ok-button" (click)="confirm.emit()">
          {{ okLabel() }}
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .action-bar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 12px 12px 12px;
      box-sizing: border-box;
    }

    .icon-button {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: var(--ngx-mat-tp-action-icon, #49454f);
      cursor: pointer;
      outline: none;
      padding: 0;
      transition: background-color 150ms ease, color 150ms ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, #6750a4);
      }
    }

    .action-svg {
      width: 24px;
      height: 24px;
    }

    .buttons-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-button {
      min-width: 64px;
      height: 40px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 20px;
      color: var(--ngx-mat-tp-action-color, #6750a4);
      font-family: var(--mat-sys-typescale-label-large-font, 'Roboto', sans-serif);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1px;
      cursor: pointer;
      outline: none;
      transition: background-color 150ms ease;

      &:hover {
        background-color: rgba(103, 80, 164, 0.08);
      }

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, #6750a4);
      }

      &.ok-button {
        font-weight: 600;
      }
    }
  `,
})
export class NgxMatActionBar {
  readonly mode = input<TimePickerMode>('dial');
  readonly cancelLabel = input<string>('Cancel');
  readonly okLabel = input<string>('OK');

  readonly modeToggle = output<void>();
  readonly cancel = output<void>();
  readonly confirm = output<void>();

  onToggleMode(): void {
    this.modeToggle.emit();
  }
}

/** @deprecated Use `NgxMatActionBar` instead. */
export { NgxMatActionBar as NgxMatActionBarComponent };

