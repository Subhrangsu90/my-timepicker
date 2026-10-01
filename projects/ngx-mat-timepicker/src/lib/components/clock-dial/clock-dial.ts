import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
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
      [class.is-dragging]="isDragging()"
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

      <!-- SVG Hand Line and Handle Rotating Along Circle -->
      <svg class="dial-hand-svg" viewBox="0 0 256 256">
        <g
          class="dial-hand-group"
          [style.transform]="'rotate(' + animatedAngle() + 'deg)'"
          style="transform-origin: 128px 128px;"
        >
          <!-- Connecting Line pointing vertically upwards from center (128, 128) -->
          <line
            x1="128"
            y1="128"
            x2="128"
            [attr.y2]="128 - handRadius()"
            class="dial-hand-line"
          />
          <!-- Handle Circle -->
          <circle
            cx="128"
            [attr.cy]="128 - handRadius()"
            [attr.r]="isInnerSelected() ? 19 : 24"
            class="dial-handle-circle"
          />
          <!-- Small dot in handle center for non-marked minute steps -->
          @if (step() === 'minute' && isIntermediateMinute()) {
            <circle
              cx="128"
              [attr.cy]="128 - handRadius()"
              r="3"
              class="dial-intermediate-dot"
            />
          }
        </g>
      </svg>

      <!-- Dial Numbers Container with step change animation -->
      @if (step() === 'hour') {
        <div class="dial-numbers-group" animate.enter="dial-numbers-enter">
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
      } @else {
        <div class="dial-numbers-group" animate.enter="dial-numbers-enter">
          @for (item of dialNumbers(); track item.value) {
            <span
              class="dial-number"
              [class.selected]="item.value === currentVal()"
              [style.left.px]="item.x"
              [style.top.px]="item.y"
            >
              {{ item.display }}
            </span>
          }
        </div>
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
      background-color: var(
        --ngx-mat-tp-dial-bg,
        var(--mat-sys-surface-container-highest, #e6e0e9)
      );
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
      transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);

      @media (max-width: 350px) {
        transform: scale(0.88);
        transform-origin: center center;
        margin: -14px 0;
      }

      &:focus-visible {
        outline: 2px solid var(--ngx-mat-tp-dial-pin, var(--mat-sys-primary, #6750a4));
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
      background-color: var(--ngx-mat-tp-dial-pin, var(--mat-sys-primary, #6750a4));
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

    .dial-hand-group {
      transform-origin: 128px 128px;
      transform-box: view-box;
      transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dial-hand-line {
      stroke: var(--ngx-mat-tp-dial-hand, var(--mat-sys-primary, #6750a4));
      stroke-width: 2;
      transition: y2 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dial-handle-circle {
      fill: var(--ngx-mat-tp-dial-handle-bg, var(--mat-sys-primary, #6750a4));
      transition: cy 200ms cubic-bezier(0.4, 0, 0.2, 1),
                  r 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dial-intermediate-dot {
      fill: var(--ngx-mat-tp-dial-handle-color, var(--mat-sys-on-primary, #ffffff));
      transition: cy 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Zero-latency response when actively dragging */
    .clock-dial.is-dragging .dial-hand-group,
    .clock-dial.is-dragging .dial-hand-line,
    .clock-dial.is-dragging .dial-handle-circle,
    .clock-dial.is-dragging .dial-intermediate-dot {
      transition: none !important;
    }

    .dial-numbers-group {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .dial-numbers-enter {
      animation: dial-fade-scale 220ms cubic-bezier(0.05, 0.7, 0.1, 1);
    }

    @keyframes dial-fade-scale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
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
      color: var(
        --ngx-mat-tp-dial-number-color,
        var(--mat-sys-on-surface, #1d1b20)
      );
      z-index: 4;
      pointer-events: none;
      transition: color 150ms ease, transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

      &.inner-ring {
        font-size: 14px;
      }

      &.selected {
        color: var(
          --ngx-mat-tp-dial-handle-color,
          var(--mat-sys-on-primary, #ffffff)
        );
        transform: scale(1.08);
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

  readonly handRadius = computed(() => {
    if (this.step() === 'hour') {
      const h = this.hour();
      const isInner = this.is24Hour() && (h === 0 || (h >= 13 && h <= 23));
      return isInner ? 68 : 100;
    }
    return 100;
  });

  readonly targetAngle = computed(() => {
    if (this.step() === 'hour') {
      return (this.hour() % 12) * 30;
    }
    return this.minute() * 6;
  });

  readonly animatedAngle = linkedSignal<number, number>({
    source: this.targetAngle,
    computation: (newTarget, previous) => {
      if (!previous) {
        return newTarget;
      }
      const prevAngle = previous.value;
      let diff = (newTarget - prevAngle) % 360;
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }
      return prevAngle + diff;
    },
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
