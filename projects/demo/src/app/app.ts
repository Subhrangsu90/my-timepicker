import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatTimepicker,
  NgxMatTimepickerDialog,
  NgxMatTimepickerInput,
  NgxMatTimepickerIntl,
  NgxMatTimepickerToggle,
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
    NgxMatTimepickerInput,
    NgxMatTimepickerToggle,
    NgxMatTimepickerDialog,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private intl = inject(NgxMatTimepickerIntl);

  // Theme state
  readonly isDarkMode = signal<boolean>(false);

  // Form Controls for Demo Scenarios
  readonly time12hControl = new FormControl('07:00 AM');
  readonly time24hControl = new FormControl('20:00');
  readonly timeLandscapeControl = new FormControl('07:30 AM');
  readonly timeStep5Control = new FormControl('09:15 AM');

  // Internationalization Showcase State
  readonly selectedLocale = signal<string>('es-ES');
  readonly timeLocaleControl = new FormControl('03:30 PM');
  readonly isRtl = signal<boolean>(false);

  // Native Date() & Timezone State
  readonly timeDateControl = new FormControl<Date | null>(new Date(2026, 8, 30, 0, 0, 0));
  readonly lastDateSetEvent = signal<string>('');

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

  constructor() {
    this.setLocale('es-ES');
  }

  toggleTheme(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    if (next) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  setLocale(loc: string): void {
    this.selectedLocale.set(loc);

    switch (loc) {
      case 'es-ES':
        this.intl.selectTimeLabel = 'Seleccionar hora';
        this.intl.enterTimeLabel = 'Introducir hora';
        this.intl.hourLabel = 'Hora';
        this.intl.minuteLabel = 'Minuto';
        this.intl.amLabel = 'a. m.';
        this.intl.pmLabel = 'p. m.';
        this.intl.cancelLabel = 'Cancelar';
        this.intl.okLabel = 'Aceptar';
        this.isRtl.set(false);
        break;

      case 'fr-FR':
        this.intl.selectTimeLabel = "Choisir l'heure";
        this.intl.enterTimeLabel = "Saisir l'heure";
        this.intl.hourLabel = 'Heure';
        this.intl.minuteLabel = 'Minute';
        this.intl.amLabel = 'AM';
        this.intl.pmLabel = 'PM';
        this.intl.cancelLabel = 'Annuler';
        this.intl.okLabel = 'OK';
        this.isRtl.set(false);
        break;

      case 'de-DE':
        this.intl.selectTimeLabel = 'Uhrzeit auswählen';
        this.intl.enterTimeLabel = 'Uhrzeit eingeben';
        this.intl.hourLabel = 'Stunde';
        this.intl.minuteLabel = 'Minute';
        this.intl.amLabel = 'Vorm.';
        this.intl.pmLabel = 'Nachm.';
        this.intl.cancelLabel = 'Abbrechen';
        this.intl.okLabel = 'OK';
        this.isRtl.set(false);
        break;

      case 'ar-SA':
        this.intl.selectTimeLabel = 'اختر الوقت';
        this.intl.enterTimeLabel = 'أدخل الوقت';
        this.intl.hourLabel = 'ساعة';
        this.intl.minuteLabel = 'دقيقة';
        this.intl.amLabel = 'ص';
        this.intl.pmLabel = 'م';
        this.intl.cancelLabel = 'إلغاء';
        this.intl.okLabel = 'موافق';
        this.isRtl.set(true);
        break;

      default: // en-US
        this.intl.selectTimeLabel = 'Select time';
        this.intl.enterTimeLabel = 'Enter time';
        this.intl.hourLabel = 'Hour';
        this.intl.minuteLabel = 'Minute';
        this.intl.amLabel = 'AM';
        this.intl.pmLabel = 'PM';
        this.intl.cancelLabel = 'Cancel';
        this.intl.okLabel = 'OK';
        this.isRtl.set(false);
        break;
    }

    this.intl.changes.next();
  }

  onTimeSet(val: TimeValue): void {
    const periodStr = val.period ? ` ${val.period}` : '';
    const formatted = `${val.hour.toString().padStart(2, '0')}:${val.minute
      .toString()
      .padStart(2, '0')}${periodStr}`;
    this.lastTimeSetEvent.set(formatted);
  }

  onDateSet(d: Date): void {
    this.lastDateSetEvent.set(d.toString());
  }

  onEmbeddedTimeSet(val: TimeValue): void {
    this.embeddedTime.set(val);
  }
}

export { App as AppComponent };
