import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Period } from '../../models/timepicker.model';

@Component({
  selector: 'ngx-mat-time-inputs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="time-inputs-container" [class.is-24h]="is24Hour()">
      <!-- Hour Input Field -->
      <div class="input-field-column">
        <div class="input-box-wrapper" [class.has-error]="hourError()">
          <input
            #hourInput
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="2"
            class="time-input"
            [value]="hourString()"
            (focus)="onInputFocus('hour')"
            (input)="onHourInput($event)"
            (keydown)="onHourKeyDown($event)"
            aria-label="Hour input"
          />
        </div>
        <span class="field-label">Hour</span>
      </div>

      <!-- Colon Separator -->
      <div class="separator-column">
        <span class="colon">:</span>
        <span class="label-spacer"></span>
      </div>

      <!-- Minute Input Field -->
      <div class="input-field-column">
        <div class="input-box-wrapper" [class.has-error]="minuteError()">
          <input
            #minuteInput
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="2"
            class="time-input"
            [value]="minuteString()"
            (focus)="onInputFocus('minute')"
            (input)="onMinuteInput($event)"
            (keydown)="onMinuteKeyDown($event)"
            aria-label="Minute input"
          />
        </div>
        <span class="field-label">Minute</span>
      </div>
    </div>

    <!-- Error message if validation fails -->
    @if (hourError() || minuteError()) {
      <div class="error-text" role="alert">
        {{ errorMessage() }}
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .time-inputs-container {
      display: flex;
      align-items: flex-start;
      gap: 0;
      justify-content: center;
    }

    .input-field-column {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .input-box-wrapper {
      width: 96px;
      height: 80px;
      border-radius: 8px;
      background-color: var(--ngx-mat-tp-time-box-unselected-bg, #e6e0e9);
      border: 2px solid transparent;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 150ms ease, background-color 150ms ease;

      &:focus-within {
        border-color: var(--ngx-mat-tp-dial-pin, #6750a4);
        background-color: var(--ngx-mat-tp-time-box-selected-bg, #eaddff);
      }

      &.has-error {
        border-color: var(--ngx-mat-tp-error-color, #b3261e) !important;
      }
    }

    .is-24h .input-box-wrapper {
      width: 114px;
    }

    .time-input {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
      text-align: center;
      font-family: var(--mat-sys-typescale-display-large-font, 'Roboto', sans-serif);
      font-size: 57px;
      line-height: 64px;
      font-weight: 400;
      color: var(--ngx-mat-tp-time-box-unselected-color, #1d1b20);
      outline: none;
      padding: 0;

      &:focus {
        color: var(--ngx-mat-tp-time-box-selected-color, #21005d);
      }
    }

    .separator-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 24px;
    }

    .colon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      font-size: 57px;
      font-weight: 400;
      color: var(--ngx-mat-tp-separator-color, #1d1b20);
      user-select: none;
    }

    @media (max-width: 350px) {
      .input-box-wrapper {
        width: 76px;
        height: 64px;
      }
      .is-24h .input-box-wrapper {
        width: 90px;
      }
      .time-input {
        font-size: 40px;
        line-height: 48px;
      }
      .colon {
        height: 64px;
        font-size: 40px;
      }
    }

    .field-label {
      font-size: 12px;
      line-height: 16px;
      color: var(--ngx-mat-tp-headline-color, #49454f);
      margin-top: 4px;
      user-select: none;
    }

    .label-spacer {
      height: 20px;
    }

    .error-text {
      font-size: 12px;
      color: var(--ngx-mat-tp-error-color, #b3261e);
      margin-top: 8px;
      text-align: center;
    }
  `,
})
export class NgxMatTimeInputs implements AfterViewInit {
  readonly hourInput = viewChild<ElementRef<HTMLInputElement>>('hourInput');
  readonly minuteInput = viewChild<ElementRef<HTMLInputElement>>('minuteInput');

  readonly hour = input.required<number>();
  readonly minute = input.required<number>();
  readonly is24Hour = input<boolean>(false);
  readonly period = input<Period | undefined>(undefined);

  readonly hourChange = output<number>();
  readonly minuteChange = output<number>();

  readonly hourError = signal<boolean>(false);
  readonly minuteError = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  ngAfterViewInit(): void {
    // Focus hour input automatically when mode opened
    setTimeout(() => {
      this.hourInput()?.nativeElement.focus();
      this.hourInput()?.nativeElement.select();
    }, 100);
  }

  hourString(): string {
    const h = this.hour();
    return h < 10 ? `0${h}` : `${h}`;
  }

  minuteString(): string {
    const m = this.minute();
    return m < 10 ? `0${m}` : `${m}`;
  }

  onInputFocus(type: 'hour' | 'minute'): void {
    if (type === 'hour') {
      this.hourInput()?.nativeElement.select();
    } else {
      this.minuteInput()?.nativeElement.select();
    }
  }

  onHourInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanVal = input.value.replace(/\D/g, '');
    input.value = cleanVal;

    if (!cleanVal) {
      this.hourError.set(false);
      return;
    }

    const val = parseInt(cleanVal, 10);
    const maxHour = this.is24Hour() ? 23 : 12;
    const minHour = this.is24Hour() ? 0 : 1;

    if (val < minHour || val > maxHour) {
      this.hourError.set(true);
      this.errorMessage.set(`Enter an hour between ${minHour} and ${maxHour}`);
    } else {
      this.hourError.set(false);
      this.errorMessage.set('');
      this.hourChange.emit(val);

      // Auto-advance to minute input when 2 digits are entered
      if (cleanVal.length >= 2 || (this.is24Hour() && val > 2) || (!this.is24Hour() && val > 1)) {
        setTimeout(() => {
          this.minuteInput()?.nativeElement.focus();
          this.minuteInput()?.nativeElement.select();
        }, 50);
      }
    }
  }

  onHourKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      this.minuteInput()?.nativeElement.focus();
      this.minuteInput()?.nativeElement.select();
    }
  }

  onMinuteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanVal = input.value.replace(/\D/g, '');
    input.value = cleanVal;

    if (!cleanVal) {
      this.minuteError.set(false);
      return;
    }

    const val = parseInt(cleanVal, 10);
    if (val < 0 || val > 59) {
      this.minuteError.set(true);
      this.errorMessage.set('Enter a minute between 00 and 59');
    } else {
      this.minuteError.set(false);
      this.errorMessage.set('');
      this.minuteChange.emit(val);
    }
  }

  onMinuteKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value) {
      event.preventDefault();
      this.hourInput()?.nativeElement.focus();
    } else if (event.key === 'ArrowLeft') {
      if (input.selectionStart === 0) {
        event.preventDefault();
        this.hourInput()?.nativeElement.focus();
      }
    }
  }
}

/** @deprecated Use `NgxMatTimeInputs` instead. */
export { NgxMatTimeInputs as NgxMatTimeInputsComponent };
