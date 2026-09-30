import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TimePickerStep } from '../models/timepicker.model';

/**
 * Injectable internationalization service that provides customizable text labels,
 * button titles, and ARIA announcements across the timepicker library.
 */
@Injectable({
  providedIn: 'root',
})
export class NgxMatTimepickerIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes = new Subject<void>();

  /** Label displayed in the dialog header in Dial mode */
  selectTimeLabel = 'Select time';

  /** Label displayed in the dialog header in Text Input mode */
  enterTimeLabel = 'Enter time';

  /** Sub-label under the hour input field */
  hourLabel = 'Hour';

  /** Sub-label under the minute input field */
  minuteLabel = 'Minute';

  /** Label for AM period */
  amLabel = 'AM';

  /** Label for PM period */
  pmLabel = 'PM';

  /** Label for Cancel action button */
  cancelLabel = 'Cancel';

  /** Label for OK/Confirm action button */
  okLabel = 'OK';

  /** Aria label for the switch to input mode button */
  switchToInputModeLabel = 'Switch to text input mode';

  /** Aria label for the switch to clock dial mode button */
  switchToDialModeLabel = 'Switch to clock dial mode';

  /** Aria label for the hour slider/dial */
  hourPickerAriaLabel = 'Hour picker';

  /** Aria label for the minute slider/dial */
  minutePickerAriaLabel = 'Minute picker';

  /** Accessible label describing selected hour */
  formatHourAriaLabel(hour: string, period?: string): string {
    return `Selected hour: ${hour}${period ? ' ' + period : ''}`.trim();
  }

  /** Accessible label describing selected minute */
  formatMinuteAriaLabel(minute: string): string {
    return `Selected minute: ${minute}`;
  }

  /** Live speech announcement when advancing between steps */
  formatStepAnnouncement(step: TimePickerStep): string {
    return step === 'hour' ? 'Select hour.' : 'Hour selected. Select minutes.';
  }

  /** Accessible label for selected value */
  formatValueAriaLabel(value: string, step: TimePickerStep, period?: string): string {
    if (step === 'hour') {
      return `${value} o'clock ${period ?? ''}`.trim();
    }
    return `${value} minutes`;
  }
}
