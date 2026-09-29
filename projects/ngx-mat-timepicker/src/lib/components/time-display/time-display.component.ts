import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePickerMode, TimePickerStep } from '../../models/timepicker.models';

@Component({
  selector: 'ngx-mat-time-display',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="time-display-container" [class.is-24h]="is24Hour()">
      <!-- Hour Box -->
      <div class="time-field-wrapper">
        <button
          type="button"
          class="time-box"
          [class.selected]="activeStep() === 'hour'"
          [class.is-input-mode]="mode() === 'input'"
          (click)="onStepClick('hour')"
          [attr.aria-label]="'Selected hour: ' + paddedHour() + (period() ? ' ' + period() : '')"
          [attr.aria-selected]="activeStep() === 'hour'"
          role="tab"
        >
          <span class="time-text">{{ paddedHour() }}</span>
        </button>
        @if (mode() === 'input') {
          <span class="time-label">Hour</span>
        }
      </div>

      <!-- Colon Separator -->
      <div class="separator-wrapper">
        <span class="time-separator" aria-hidden="true">:</span>
        @if (mode() === 'input') {
          <span class="label-spacer"></span>
        }
      </div>

      <!-- Minute Box -->
      <div class="time-field-wrapper">
        <button
          type="button"
          class="time-box"
          [class.selected]="activeStep() === 'minute'"
          [class.is-input-mode]="mode() === 'input'"
          (click)="onStepClick('minute')"
          [attr.aria-label]="'Selected minute: ' + paddedMinute()"
          [attr.aria-selected]="activeStep() === 'minute'"
          role="tab"
        >
          <span class="time-text">{{ paddedMinute() }}</span>
        </button>
        @if (mode() === 'input') {
          <span class="time-label">Minute</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .time-display-container {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    .time-field-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .time-box {
      width: 96px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 2px solid transparent;
      background-color: var(--ngx-mat-tp-time-box-unselected-bg, #e6e0e9);
      color: var(--ngx-mat-tp-time-box-unselected-color, #1d1b20);
      cursor: pointer;
      outline: none;
      padding: 0;
      transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  color 150ms cubic-bezier(0.4, 0, 0.2, 1);

      &.selected {
        background-color: var(--ngx-mat-tp-time-box-selected-bg, #eaddff);
        color: var(--ngx-mat-tp-time-box-selected-color, #21005d);
      }

      &.is-input-mode.selected {
        border-color: var(--ngx-mat-tp-dial-pin, #6750a4);
      }

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, #6750a4);
        outline-offset: 2px;
      }
    }

    .is-24h .time-box {
      width: 114px;
    }

    .time-text {
      font-family: var(--mat-sys-typescale-display-large-font, 'Roboto', sans-serif);
      font-size: 57px;
      line-height: 64px;
      font-weight: 400;
      letter-spacing: -0.25px;
      user-select: none;
    }

    .separator-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 24px;
    }

    .time-separator {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      font-size: 57px;
      font-weight: 400;
      color: var(--ngx-mat-tp-separator-color, #1d1b20);
      user-select: none;
    }

    .time-label {
      font-size: 12px;
      line-height: 16px;
      color: var(--ngx-mat-tp-headline-color, #49454f);
      margin-top: 4px;
      user-select: none;
    }

    .label-spacer {
      height: 20px;
    }
  `,
})
export class NgxMatTimeDisplayComponent {
  readonly hour = input.required<number>();
  readonly minute = input.required<number>();
  readonly period = input<string | undefined>(undefined);
  readonly activeStep = input<TimePickerStep>('hour');
  readonly mode = input<TimePickerMode>('dial');
  readonly is24Hour = input<boolean>(false);

  readonly stepChange = output<TimePickerStep>();

  readonly paddedHour = computed(() => {
    const h = this.hour();
    return h < 10 ? `0${h}` : `${h}`;
  });

  readonly paddedMinute = computed(() => {
    const m = this.minute();
    return m < 10 ? `0${m}` : `${m}`;
  });

  onStepClick(step: TimePickerStep): void {
    this.stepChange.emit(step);
  }
}
