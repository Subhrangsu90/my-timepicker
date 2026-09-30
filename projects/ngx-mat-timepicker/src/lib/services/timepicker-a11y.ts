import { inject, Injectable } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TimePickerStep, TimeValue } from '../models/timepicker.model';

@Injectable({
  providedIn: 'root',
})
export class TimepickerA11y {
  private liveAnnouncer = inject(LiveAnnouncer, { optional: true });

  announceStep(step: TimePickerStep): void {
    const message = step === 'hour' ? 'Select hour.' : 'Hour selected. Select minutes.';
    this.announce(message);
  }

  announceSelection(step: TimePickerStep, value: number, period?: string): void {
    const formattedVal = value.toString().padStart(2, '0');
    let message = '';
    if (step === 'hour') {
      message = `${formattedVal} hours ${period ?? ''}`.trim();
    } else {
      message = `${formattedVal} minutes`;
    }
    this.announce(message);
  }

  announce(message: string): void {
    if (this.liveAnnouncer) {
      this.liveAnnouncer.announce(message, 'polite');
    }
  }

  handleStepKeyboardNav(
    event: KeyboardEvent,
    currentValue: number,
    step: TimePickerStep,
    format: 12 | 24,
    stepMinute = 1
  ): number | null {
    let nextValue = currentValue;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        event.preventDefault();
        if (step === 'hour') {
          if (format === 12) {
            nextValue = currentValue >= 12 ? 1 : currentValue + 1;
          } else {
            nextValue = (currentValue + 1) % 24;
          }
        } else {
          nextValue = (currentValue + stepMinute) % 60;
        }
        return nextValue;

      case 'ArrowDown':
      case 'ArrowLeft':
        event.preventDefault();
        if (step === 'hour') {
          if (format === 12) {
            nextValue = currentValue <= 1 ? 12 : currentValue - 1;
          } else {
            nextValue = currentValue <= 0 ? 23 : currentValue - 1;
          }
        } else {
          nextValue = currentValue - stepMinute < 0 ? 60 - stepMinute : currentValue - stepMinute;
        }
        return nextValue;

      case 'PageUp':
        event.preventDefault();
        if (step === 'minute') {
          nextValue = (currentValue + 5) % 60;
        } else {
          if (format === 12) {
            nextValue = ((currentValue + 2) % 12) || 12;
          } else {
            nextValue = (currentValue + 3) % 24;
          }
        }
        return nextValue;

      case 'PageDown':
        event.preventDefault();
        if (step === 'minute') {
          nextValue = currentValue - 5 < 0 ? 60 + (currentValue - 5) : currentValue - 5;
        } else {
          if (format === 12) {
            const h = currentValue - 3;
            nextValue = h <= 0 ? 12 + h : h;
          } else {
            const h = currentValue - 3;
            nextValue = h < 0 ? 24 + h : h;
          }
        }
        return nextValue;

      case 'Home':
        event.preventDefault();
        return step === 'hour' ? (format === 12 ? 1 : 0) : 0;

      case 'End':
        event.preventDefault();
        return step === 'hour' ? (format === 12 ? 12 : 23) : 59;

      default:
        return null;
    }
  }
}

/** @deprecated Use `TimepickerA11y` instead. */
export { TimepickerA11y as TimepickerA11yService };
