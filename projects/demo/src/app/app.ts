import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatTimepicker,
  NgxMatTimepickerDialogComponent,
  NgxMatTimepickerInputDirective,
  NgxMatTimepickerToggleComponent,
  TimeFormat,
  TimePickerOrientation,
  TimeValue,
} from 'ngx-mat-timepicker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatTimepicker,
    NgxMatTimepickerInputDirective,
    NgxMatTimepickerToggleComponent,
    NgxMatTimepickerDialogComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  // Theme state
  readonly isDarkMode = signal<boolean>(false);

  // Form Controls for Demo Scenarios
  readonly time12hControl = new FormControl('07:00 AM');
  readonly time24hControl = new FormControl('20:00');
  readonly timeLandscapeControl = new FormControl('07:30 AM');
  readonly timeStep5Control = new FormControl('09:15 AM');

  // Playground Config State
  readonly playgroundControl = new FormControl('02:45 PM');
  readonly playgroundFormat = signal<TimeFormat>('12h');
  readonly playgroundOrientation = signal<TimePickerOrientation>('auto');
  readonly playgroundStepMinute = signal<number>(1);
  readonly playgroundAutoAdvance = signal<boolean>(true);
  readonly playgroundDisabled = signal<boolean>(false);

  // Captured Events
  readonly lastTimeSetEvent = signal<string>('None yet');

  // Embedded Dialog State
  readonly embeddedTime = signal<TimeValue>({ hour: 7, minute: 0, period: 'AM' });
  readonly embeddedFormat = signal<TimeFormat>('12h');

  toggleTheme(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    if (next) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  onTimeSet(val: TimeValue): void {
    const periodStr = val.period ? ` ${val.period}` : '';
    const formatted = `${val.hour.toString().padStart(2, '0')}:${val.minute
      .toString()
      .padStart(2, '0')}${periodStr}`;
    this.lastTimeSetEvent.set(formatted);
  }

  onEmbeddedTimeSet(val: TimeValue): void {
    this.embeddedTime.set(val);
  }
}

export { App as AppComponent };
