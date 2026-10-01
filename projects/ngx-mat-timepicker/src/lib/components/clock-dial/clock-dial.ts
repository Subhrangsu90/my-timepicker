import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockDialNumber, Period, TimePickerStep } from '../../models/timepicker.model';
import { TimepickerA11y } from '../../services/timepicker-a11y';

@Component({
  selector: 'ngx-mat-clock-dial',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #dialFace
      class="clock-dial"
      role="slider"
      tabindex="0"
      [attr.aria-label]="step() === 'hour' ? 'Hour picker' : 'Minute picker'"
      [attr.aria-valuemin]="step() === 'hour' ? (is24Hour() ? 0 : 1) : 0"
      [attr.aria-valuemax]="step() === 'hour' ? (is24Hour() ? 23 : 12) : 59"
      [attr.aria-valuenow]="currentVal()"
      [attr.aria-valuetext]="ariaValueText()"
      (keydown)="onKeyDown($event)"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
    >
      <!-- Center Pin -->
      <div class="dial-center-pin"></div>

      <!-- SVG Hand Line and Handle -->
      <svg class="dial-hand-svg" viewBox="0 0 256 256">
        <!-- Connecting Line -->
        <line
          x1="128"
          y1="128"
          [attr.x2]="selectedCoord().x"
          [attr.y2]="selectedCoord().y"
          class="dial-hand-line"
        />
        <!-- Handle Circle -->
        <circle
          [attr.cx]="selectedCoord().x"
          [attr.cy]="selectedCoord().y"
          [attr.r]="isInnerSelected() ? 19 : 24"
          class="dial-handle-circle"
        />
        <!-- Small dot in handle center for non-marked minute steps -->
        @if (step() === 'minute' && isIntermediateMinute()) {
          <circle
            [attr.cx]="selectedCoord().x"
            [attr.cy]="selectedCoord().y"
            r="3"
            class="dial-intermediate-dot"
          />
        }
      </svg>

      <!-- Dial Numbers -->
      @for (item of dialNumbers(); track item.value + '-' + (item.isInner ? 'in' : 'out')) {
        <span
          class="dial-number"
          [class.inner-ring]="item.isInner"
          [class.selected]="item.value === currentVal() && (item.isInner ? isInnerSelected() : !isInnerSelected())"
          [style.left.px]="item.x"
          [style.top.px]="item.y"
        >
          {{ item.display }}
        </span>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      user-select: none;
      touch-action: none;
    }

    .clock-dial {
      position: relative;
      width: 256px;
      height: 256px;
      border-radius: 50%;
      background-color: var(--ngx-mat-tp-dial-bg, #e6e0e9);
      cursor: pointer;
      outline: none;
      box-sizing: border-box;

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, #6750a4);
        outline-offset: 4px;
      }
    }

    .dial-center-pin {
      position: absolute;
      top: 124px;
      left: 124px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--ngx-mat-tp-dial-pin, #6750a4);
      z-index: 3;
      pointer-events: none;
    }

    .dial-hand-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 256px;
      height: 256px;
      z-index: 2;
      pointer-events: none;
    }

    .dial-hand-line {
      stroke: var(--ngx-mat-tp-dial-hand, #6750a4);
      stroke-width: 2;
    }

    .dial-handle-circle {
      fill: var(--ngx-mat-tp-dial-handle-bg, #6750a4);
    }

    .dial-intermediate-dot {
      fill: var(--ngx-mat-tp-dial-handle-color, #ffffff);
    }

    .dial-number {
      position: absolute;
      width: 48px;
      height: 48px;
      margin-left: -24px;
      margin-top: -24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--mat-sys-typescale-body-large-font, 'Roboto', sans-serif);
      font-size: 16px;
      font-weight: 500;
      color: var(--ngx-mat-tp-dial-number-color, #1d1b20);
      z-index: 4;
      pointer-events: none;
      transition: color 150ms ease;

      &.inner-ring {
        font-size: 14px;
      }

      &.selected {
        color: var(--ngx-mat-tp-dial-handle-color, #ffffff);
      }
    }
  `,
})
export class NgxMatClockDial {
  private a11y = inject(TimepickerA11y);

  readonly dialFace = viewChild.required<ElementRef<HTMLElement>>('dialFace');

  readonly step = input.required<TimePickerStep>();
  readonly hour = input.required<number>();
  readonly minute = input.required<number>();
  readonly is24Hour = input<boolean>(false);
  readonly period = input<Period | undefined>(undefined);
  readonly stepMinute = input<number>(1);
  readonly autoAdvance = input<boolean>(true);

  readonly valueChange = output<{ step: TimePickerStep; value: number }>();
  readonly autoAdvanceStep = output<void>();

  private isDragging = signal(false);

  readonly currentVal = computed(() => {
    return this.step() === 'hour' ? this.hour() : this.minute();
  });

  readonly isInnerSelected = computed(() => {
    if (this.step() === 'hour' && this.is24Hour()) {
      const h = this.hour();
      return h === 0 || (h >= 13 && h <= 23);
    }
    return false;
  });

  readonly isIntermediateMinute = computed(() => {
    if (this.step() === 'minute') {
      return this.minute() % 5 !== 0;
    }
    return false;
  });

  readonly ariaValueText = computed(() => {
    const val = this.currentVal();
    const formatted = val < 10 ? `0${val}` : `${val}`;
    if (this.step() === 'hour') {
      return `${formatted} o'clock ${this.period() ?? ''}`.trim();
    }
    return `${formatted} minutes`;
  });

  readonly dialNumbers = computed<ClockDialNumber[]>(() => {
    const numbers: ClockDialNumber[] = [];
    const center = 128;
    const outerRadius = 100;
    const innerRadius = 68;

    if (this.step() === 'hour') {
      if (this.is24Hour()) {
        // Outer ring: 1 to 12
        for (let i = 1; i <= 12; i++) {
          const angle = (i * 30) % 360;
          const rad = (angle * Math.PI) / 180;
          numbers.push({
            value: i,
            display: `${i}`,
            angle,
            x: center + outerRadius * Math.sin(rad),
            y: center - outerRadius * Math.cos(rad),
            isInner: false,
          });
        }
        // Inner ring: 13 to 23, and 00 at 12 o'clock
        for (let i = 1; i <= 12; i++) {
          const val = i === 12 ? 0 : i + 12;
          const angle = (i * 30) % 360;
          const rad = (angle * Math.PI) / 180;
          numbers.push({
            value: val,
            display: val === 0 ? '00' : `${val}`,
            angle,
            x: center + innerRadius * Math.sin(rad),
            y: center - innerRadius * Math.cos(rad),
            isInner: true,
          });
        }
      } else {
        // 12-Hour format (1 to 12)
        for (let i = 1; i <= 12; i++) {
          const angle = (i * 30) % 360;
          const rad = (angle * Math.PI) / 180;
          numbers.push({
            value: i,
            display: `${i}`,
            angle,
            x: center + outerRadius * Math.sin(rad),
            y: center - outerRadius * Math.cos(rad),
            isInner: false,
          });
        }
      }
    } else {
      // Minute dial: 00, 05, 10, ... 55
      for (let i = 0; i < 60; i += 5) {
        const angle = i * 6;
        const rad = (angle * Math.PI) / 180;
        numbers.push({
          value: i,
          display: i < 10 ? `0${i}` : `${i}`,
          angle,
          x: center + outerRadius * Math.sin(rad),
          y: center - outerRadius * Math.cos(rad),
          isInner: false,
        });
      }
    }

    return numbers;
  });

  readonly selectedCoord = computed<{ x: number; y: number }>(() => {
    const center = 128;
    const outerRadius = 100;
    const innerRadius = 68;

    if (this.step() === 'hour') {
      const h = this.hour();
      const isInner = this.is24Hour() && (h === 0 || (h >= 13 && h <= 23));
      const radius = isInner ? innerRadius : outerRadius;
      const angle = (h % 12) * 30;
      const rad = (angle * Math.PI) / 180;
      return {
        x: center + radius * Math.sin(rad),
        y: center - radius * Math.cos(rad),
      };
    } else {
      const m = this.minute();
      const angle = m * 6;
      const rad = (angle * Math.PI) / 180;
      return {
        x: center + outerRadius * Math.sin(rad),
        y: center - outerRadius * Math.cos(rad),
      };
    }
  });

  onPointerDown(event: PointerEvent): void {
    const el = this.dialFace().nativeElement;
    el.setPointerCapture(event.pointerId);
    this.isDragging.set(true);
    this.updateFromPointer(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (this.isDragging()) {
      this.updateFromPointer(event);
    }
  }

  onPointerUp(event: PointerEvent): void {
    if (this.isDragging()) {
      const el = this.dialFace().nativeElement;
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        // Ignored
      }
      this.isDragging.set(false);
      this.updateFromPointer(event);

      // Auto-advance to minute step if hour was selected
      if (this.step() === 'hour' && this.autoAdvance()) {
        setTimeout(() => {
          this.autoAdvanceStep.emit();
        }, 180);
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const current = this.currentVal();
    const next = this.a11y.handleStepKeyboardNav(
      event,
      current,
      this.step(),
      this.is24Hour() ? 24 : 12,
      this.stepMinute()
    );

    if (next !== null) {
      this.valueChange.emit({ step: this.step(), value: next });
      this.a11y.announceSelection(this.step(), next, this.period());
    }
  }

  private updateFromPointer(event: PointerEvent): void {
    const rect = this.dialFace().nativeElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    // Radius from center normalized to 256dp dial coordinate space
    const scale = rect.width > 0 ? rect.width / 256 : 1;
    const distance = Math.hypot(x, y) / scale;

    // Calculate angle in degrees from 12 o'clock (0..360)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) {
      angle += 360;
    }

    if (this.step() === 'hour') {
      // 30 degrees per hour
      let rawHour = Math.round(angle / 30) % 12;
      let finalHour: number;

      if (this.is24Hour()) {
        const isInner = distance < 84;
        if (isInner) {
          finalHour = rawHour === 0 ? 0 : rawHour + 12;
        } else {
          finalHour = rawHour === 0 ? 12 : rawHour;
        }
      } else {
        finalHour = rawHour === 0 ? 12 : rawHour;
      }

      this.valueChange.emit({ step: 'hour', value: finalHour });
    } else {
      // Minute calculation: 6 degrees per minute
      let rawMinute = Math.round(angle / 6) % 60;
      const step = this.stepMinute();
      if (step > 1) {
        rawMinute = Math.round(rawMinute / step) * step;
        rawMinute = rawMinute % 60;
      }

      this.valueChange.emit({ step: 'minute', value: rawMinute });
    }
  }
}

/** @deprecated Use `NgxMatClockDial` instead. */
export { NgxMatClockDial as NgxMatClockDialComponent };
