import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Period } from '../../models/timepicker.models';

@Component({
  selector: 'ngx-mat-period-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="period-toggle-group"
      [class.horizontal]="orientation() === 'horizontal'"
      role="radiogroup"
      aria-label="Select AM or PM"
    >
      <button
        type="button"
        class="period-segment"
        [class.selected]="period() === 'AM'"
        (click)="selectPeriod('AM')"
        role="radio"
        [attr.aria-checked]="period() === 'AM'"
        aria-label="AM"
      >
        <span class="period-text">AM</span>
      </button>

      <div class="segment-divider"></div>

      <button
        type="button"
        class="period-segment"
        [class.selected]="period() === 'PM'"
        (click)="selectPeriod('PM')"
        role="radio"
        [attr.aria-checked]="period() === 'PM'"
        aria-label="PM"
      >
        <span class="period-text">PM</span>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .period-toggle-group {
      display: flex;
      flex-direction: column;
      width: 52px;
      height: 80px;
      border: 1px solid var(--ngx-mat-tp-period-border, #79747e);
      border-radius: 8px;
      overflow: hidden;
      box-sizing: border-box;

      &.horizontal {
        flex-direction: row;
        width: 216px;
        height: 40px;
      }
    }

    .period-segment {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--ngx-mat-tp-period-unselected-color, #49454f);
      cursor: pointer;
      outline: none;
      padding: 0;
      transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  color 150ms cubic-bezier(0.4, 0, 0.2, 1);

      &.selected {
        background-color: var(--ngx-mat-tp-period-selected-bg, #ffd8e4);
        color: var(--ngx-mat-tp-period-selected-color, #31111d);
      }

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, #6750a4);
        outline-offset: -2px;
      }
    }

    .segment-divider {
      background-color: var(--ngx-mat-tp-period-border, #79747e);
      width: 100%;
      height: 1px;

      .horizontal & {
        width: 1px;
        height: 100%;
      }
    }

    .period-text {
      font-family: var(--mat-sys-typescale-title-small-font, 'Roboto', sans-serif);
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: 0.1px;
      user-select: none;
    }
  `,
})
export class NgxMatPeriodToggleComponent {
  readonly period = input.required<Period>();
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');

  readonly periodChange = output<Period>();

  selectPeriod(p: Period): void {
    if (this.period() !== p) {
      this.periodChange.emit(p);
    }
  }
}
