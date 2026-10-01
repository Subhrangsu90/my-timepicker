import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TimePickerMode, TimePickerStep } from '../../models/timepicker.model';

@Component({
  selector: 'ngx-mat-time-display',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="time-display-container" [class.is-24h]="is24Hour()">
      <!-- Hour Box -->
      <div class="time-field-wrapper">
        <div
          class="time-box"
          [class.selected]="activeStep() === 'hour'"
          [class.is-input-mode]="mode() === 'input'"
          (click)="onBoxClick('hour')"
          role="presentation"
        >
          <input
            #hourInput
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="2"
            class="time-input"
            [value]="paddedHour()"
            (focus)="onInputFocus('hour')"
            (input)="onHourInput($event)"
            (keydown)="onHourKeyDown($event)"
            (blur)="onInputBlur('hour')"
            [attr.aria-label]="'Selected hour: ' + paddedHour() + (period() ? ' ' + period() : '')"
            [attr.aria-selected]="activeStep() === 'hour'"
          />
        </div>
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
        <div
          class="time-box"
          [class.selected]="activeStep() === 'minute'"
          [class.is-input-mode]="mode() === 'input'"
          (click)="onBoxClick('minute')"
          role="presentation"
        >
          <input
            #minuteInput
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="2"
            class="time-input"
            [value]="paddedMinute()"
            (focus)="onInputFocus('minute')"
            (input)="onMinuteInput($event)"
            (keydown)="onMinuteKeyDown($event)"
            (blur)="onInputBlur('minute')"
            [attr.aria-label]="'Selected minute: ' + paddedMinute()"
            [attr.aria-selected]="activeStep() === 'minute'"
          />
        </div>
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
      cursor: text;
      outline: none;
      padding: 0;
      box-sizing: border-box;
      transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

      &.selected,
      &:focus-within {
        background-color: var(--ngx-mat-tp-time-box-selected-bg, #eaddff);
        color: var(--ngx-mat-tp-time-box-selected-color, #21005d);
        border-color: var(--ngx-mat-tp-dial-pin, #6750a4);
        transform: scale(1.02);
      }
    }

    .is-24h .time-box {
      width: 114px;
    }

    .time-input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      text-align: center;
      font-family: var(--mat-sys-typescale-display-large-font, 'Roboto', sans-serif);
      font-size: 57px;
      line-height: 64px;
      font-weight: 400;
      letter-spacing: -0.25px;
      color: inherit;
      caret-color: var(--ngx-mat-tp-dial-pin, #6750a4);
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      user-select: all;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
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

    @media (max-width: 350px) {
      .time-box {
        width: 76px;
        height: 64px;
      }
      .is-24h .time-box {
        width: 90px;
      }
      .time-input {
        font-size: 40px;
        line-height: 48px;
      }
      .time-separator {
        height: 64px;
        font-size: 40px;
      }
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
export class NgxMatTimeDisplay implements OnDestroy {
  private document = inject(DOCUMENT);

  readonly hourInput = viewChild<ElementRef<HTMLInputElement>>('hourInput');
  readonly minuteInput = viewChild<ElementRef<HTMLInputElement>>('minuteInput');

  readonly hour = input.required<number>();
  readonly minute = input.required<number>();
  readonly period = input<string | undefined>(undefined);
  readonly activeStep = input<TimePickerStep>('hour');
  readonly mode = input<TimePickerMode>('dial');
  readonly is24Hour = input<boolean>(false);
  readonly stepMinute = input<number>(1);

  readonly stepChange = output<TimePickerStep>();
  readonly hourChange = output<number>();
  readonly minuteChange = output<number>();

  private isEditingHour = false;
  private isEditingMinute = false;
  private autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly paddedHour = computed(() => {
    const h = this.hour();
    return h < 10 ? `0${h}` : `${h}`;
  });

  readonly paddedMinute = computed(() => {
    const m = this.minute();
    return m < 10 ? `0${m}` : `${m}`;
  });

  constructor() {
    // Keep DOM inputs synchronized with incoming signal changes when not actively typing
    effect(() => {
      const h = this.paddedHour();
      const el = this.hourInput()?.nativeElement;
      if (el && !this.isEditingHour) {
        el.value = h;
      }
    });

    effect(() => {
      const m = this.paddedMinute();
      const el = this.minuteInput()?.nativeElement;
      if (el && !this.isEditingMinute) {
        el.value = m;
      }
    });

    effect(() => {
      const step = this.activeStep();
      if (step === 'minute') {
        const el = this.minuteInput()?.nativeElement;
        if (el && this.document?.activeElement === this.hourInput()?.nativeElement) {
          el.focus();
          el.select();
        }
      } else if (step === 'hour') {
        const el = this.hourInput()?.nativeElement;
        if (el && this.document?.activeElement === this.minuteInput()?.nativeElement) {
          el.focus();
          el.select();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  onBoxClick(step: TimePickerStep): void {
    this.stepChange.emit(step);
    if (step === 'hour') {
      const el = this.hourInput()?.nativeElement;
      if (el) {
        el.focus();
        el.select();
      }
    } else {
      const el = this.minuteInput()?.nativeElement;
      if (el) {
        el.focus();
        el.select();
      }
    }
  }

  onInputFocus(step: TimePickerStep): void {
    this.stepChange.emit(step);
    if (step === 'hour') {
      this.isEditingHour = false;
      this.hourInput()?.nativeElement.select();
    } else {
      this.isEditingMinute = false;
      this.minuteInput()?.nativeElement.select();
    }
  }

  onInputBlur(step: TimePickerStep): void {
    if (step === 'hour') {
      this.isEditingHour = false;
      const el = this.hourInput()?.nativeElement;
      if (el) {
        el.value = this.paddedHour();
      }
    } else {
      this.isEditingMinute = false;
      const el = this.minuteInput()?.nativeElement;
      if (el) {
        el.value = this.paddedMinute();
      }
    }
  }

  onHourInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanVal = input.value.replace(/\D/g, '');
    input.value = cleanVal;

    if (!cleanVal) {
      this.isEditingHour = true;
      return;
    }

    this.isEditingHour = true;
    let val = parseInt(cleanVal, 10);
    const is24 = this.is24Hour();
    const maxHour = is24 ? 23 : 12;
    const minHour = is24 ? 0 : 1;

    if (val > maxHour) {
      val = maxHour;
      input.value = `${val}`;
    }

    if (val >= minHour && val <= maxHour) {
      this.hourChange.emit(val);
    }

    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    const shouldAutoAdvance =
      cleanVal.length >= 2 ||
      (!is24 && val > 1) ||
      (is24 && val > 2);

    if (shouldAutoAdvance) {
      this.autoAdvanceTimer = setTimeout(() => {
        this.isEditingHour = false;
        input.value = this.paddedHour();
        this.stepChange.emit('minute');
        const minEl = this.minuteInput()?.nativeElement;
        if (minEl) {
          minEl.focus();
          minEl.select();
        }
      }, 150);
    }
  }

  onHourKeyDown(event: KeyboardEvent): void {
    const is24 = this.is24Hour();
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.isEditingHour = false;
      let next: number;
      if (is24) {
        next = (this.hour() + 1) % 24;
      } else {
        next = this.hour() + 1;
        if (next > 12) next = 1;
      }
      this.hourChange.emit(next);
      const el = this.hourInput()?.nativeElement;
      if (el) {
        el.value = next < 10 ? `0${next}` : `${next}`;
        el.select();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isEditingHour = false;
      let next: number;
      if (is24) {
        next = (this.hour() - 1 + 24) % 24;
      } else {
        next = this.hour() - 1;
        if (next < 1) next = 12;
      }
      this.hourChange.emit(next);
      const el = this.hourInput()?.nativeElement;
      if (el) {
        el.value = next < 10 ? `0${next}` : `${next}`;
        el.select();
      }
    } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      this.isEditingHour = false;
      const el = this.hourInput()?.nativeElement;
      if (el) {
        el.value = this.paddedHour();
      }
      this.stepChange.emit('minute');
      const minEl = this.minuteInput()?.nativeElement;
      if (minEl) {
        minEl.focus();
        minEl.select();
      }
    }
  }

  onMinuteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanVal = input.value.replace(/\D/g, '');
    input.value = cleanVal;

    if (!cleanVal) {
      this.isEditingMinute = true;
      return;
    }

    this.isEditingMinute = true;
    let val = parseInt(cleanVal, 10);
    if (val > 59) {
      val = 59;
      input.value = `${val}`;
    }

    if (val >= 0 && val <= 59) {
      this.minuteChange.emit(val);
    }

    if (cleanVal.length >= 2) {
      this.isEditingMinute = false;
      input.value = val < 10 ? `0${val}` : `${val}`;
    }
  }

  onMinuteKeyDown(event: KeyboardEvent): void {
    const step = this.stepMinute() || 1;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.isEditingMinute = false;
      const next = (this.minute() + step) % 60;
      this.minuteChange.emit(next);
      const el = this.minuteInput()?.nativeElement;
      if (el) {
        el.value = next < 10 ? `0${next}` : `${next}`;
        el.select();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isEditingMinute = false;
      const next = (this.minute() - step + 60) % 60;
      this.minuteChange.emit(next);
      const el = this.minuteInput()?.nativeElement;
      if (el) {
        el.value = next < 10 ? `0${next}` : `${next}`;
        el.select();
      }
    } else if (event.key === 'ArrowLeft') {
      const input = event.target as HTMLInputElement;
      if (input.selectionStart === 0) {
        event.preventDefault();
        this.isEditingMinute = false;
        input.value = this.paddedMinute();
        this.stepChange.emit('hour');
        const hrEl = this.hourInput()?.nativeElement;
        if (hrEl) {
          hrEl.focus();
          hrEl.select();
        }
      }
    } else if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      if (!input.value) {
        event.preventDefault();
        this.isEditingMinute = false;
        input.value = this.paddedMinute();
        this.stepChange.emit('hour');
        const hrEl = this.hourInput()?.nativeElement;
        if (hrEl) {
          hrEl.focus();
          hrEl.select();
        }
      }
    }
  }
}

/** @deprecated Use `NgxMatTimeDisplay` instead. */
export { NgxMatTimeDisplay as NgxMatTimeDisplayComponent };
