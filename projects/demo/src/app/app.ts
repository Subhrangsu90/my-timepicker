import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';

// Real Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';

// ngx-mat-timepicker library imports
import {
  NgxMatTimepicker,
  NgxMatTimepickerDialog,
  NgxMatTimepickerInput,
  NgxMatTimepickerIntl,
  NgxMatTimepickerToggle,
  TimeFormat,
  TimePickerOrientation,
  TimeValue,
} from '@ngx-material/timepicker';

export type DocTab = 'overview' | 'api' | 'styling' | 'examples';

export interface ThemePreset {
  id: string;
  name: string;
  primaryLight: string;
  primaryDark: string;
  containerLight: string;
  containerDark: string;
  chipColor: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormField,
    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule,
    MatSliderModule,
    // ngx-mat-timepicker
    NgxMatTimepicker,
    NgxMatTimepickerInput,
    NgxMatTimepickerToggle,
    NgxMatTimepickerDialog,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly intl = inject(NgxMatTimepickerIntl);

  // Active Top Navigation Tab
  readonly activeTab = signal<DocTab>('overview');

  // Dark/Light Theme state (Default dark to match Angular Material documentation)
  readonly isDarkMode = signal<boolean>(true);

  // Active TOC Anchor
  readonly activeToc = signal<string>('basic');

  // Copied feedback messages
  readonly copyFeedback = signal<string | null>(null);
  readonly copiedNpm = signal<boolean>(false);

  // Code snippets expansion state per example ID
  readonly expandedCode = signal<Record<string, boolean>>({});

  // Active code tab ('html' | 'ts' | 'css') per example ID
  readonly activeCodeTab = signal<Record<string, 'html' | 'ts' | 'css'>>({});

  // API Search Query Filter
  readonly apiSearchQuery = signal<string>('');

  // ---------------------------------------------------------------------------
  // Overview Tab Form Controls
  // ---------------------------------------------------------------------------
  readonly basicTimeControl = new FormControl('07:30 AM');
  readonly time12hControl = new FormControl('09:15 AM');
  readonly time24hControl = new FormControl('21:45');
  readonly timeLandscapeControl = new FormControl('08:00 AM');
  readonly timeStepControl = new FormControl('10:15 AM');
  readonly currentStep = signal<number>(15);
  readonly timeValidationControl = new FormControl('', [Validators.required]);
  readonly timeDateControl = new FormControl<Date | null>(new Date(2026, 9, 2, 14, 30, 0));

  // Angular Signal Forms Example
  readonly signalFormModel = signal({
    meetingTime: '10:30 AM',
  });
  readonly signalForm = form(this.signalFormModel, (s) => {
    required(s.meetingTime, { message: 'Meeting time is required' });
  });

  // ---------------------------------------------------------------------------
  // Scenarios & Real-World Examples
  // ---------------------------------------------------------------------------
  // Scenario 1: Flight Itinerary
  readonly flightDeparture = new FormControl('08:45 AM', [Validators.required]);
  readonly flightArrival = new FormControl('01:30 PM', [Validators.required]);
  readonly flightSeatClass = new FormControl('Business');

  // Scenario 2: Medical Clinic Scheduler
  readonly doctorCategory = new FormControl('cardiology');
  readonly appointmentTime = new FormControl('10:30 AM', [Validators.required]);
  readonly appointmentStep = signal<number>(15);

  // Scenario 3: Timesheet Time Tracker (Signal Forms)
  readonly timesheetModel = signal({
    clockIn: '09:00 AM',
    clockOut: '05:30 PM',
    taskDescription: 'Frontend component library maintenance',
  });
  readonly timesheetForm = form(this.timesheetModel, (s) => {
    required(s.clockIn, { message: 'Clock-in time is required' });
    required(s.clockOut, { message: 'Clock-out time is required' });
  });

  // Scenario 4: Global Scheduler (i18n & RTL)
  readonly selectedLocale = signal<string>('en-US');
  readonly isRtl = signal<boolean>(false);
  readonly globalMeetingTime = new FormControl('03:30 PM');

  // ---------------------------------------------------------------------------
  // Live Playground & Styling Theme Customizer
  // ---------------------------------------------------------------------------
  readonly themePresets: ThemePreset[] = [
    {
      id: 'violet',
      name: 'Material Violet',
      primaryLight: '#6750a4',
      primaryDark: '#d0bcff',
      containerLight: '#eaddff',
      containerDark: '#4f378b',
      chipColor: '#7c4dff',
    },
    {
      id: 'rose',
      name: 'Rose Quartz',
      primaryLight: '#b32658',
      primaryDark: '#f48fb1',
      containerLight: '#ffd8e4',
      containerDark: '#633b48',
      chipColor: '#f48fb1',
    },
    {
      id: 'azure',
      name: 'Electric Azure',
      primaryLight: '#0061a4',
      primaryDark: '#9ecaff',
      containerLight: '#d1e4ff',
      containerDark: '#00497d',
      chipColor: '#29b6f6',
    },
    {
      id: 'emerald',
      name: 'Emerald Green',
      primaryLight: '#2e6c43',
      primaryDark: '#8cd69b',
      containerLight: '#b7f397',
      containerDark: '#005324',
      chipColor: '#66bb6a',
    },
    {
      id: 'amber',
      name: 'Sunset Amber',
      primaryLight: '#8c5000',
      primaryDark: '#ffb870',
      containerLight: '#ffdcbe',
      containerDark: '#6e3900',
      chipColor: '#ffa726',
    },
  ];

  readonly activePreset = signal<ThemePreset>(this.themePresets[0]);
  readonly customRadiusNumber = signal<number>(28);
  readonly customRadius = computed(() => `${this.customRadiusNumber()}px`);
  readonly playgroundFormat = signal<TimeFormat>('12h');
  readonly playgroundOrientation = signal<TimePickerOrientation>('vertical');
  readonly playgroundStep = signal<number>(1);
  readonly embeddedTime = signal<TimeValue>({ hour: 9, minute: 41, period: 'AM' });

  // Code snippets for copy
  readonly snippetBasicHtml = `<mat-form-field appearance="outline">
  <mat-label>Meeting Time</mat-label>
  <mat-icon matPrefix>schedule</mat-icon>
  <input matInput [ngxMatTimepicker]="picker" [formControl]="timeControl" placeholder="hh:mm aa">
  <ngx-mat-timepicker-toggle matIconSuffix [for]="picker"/>
  <mat-hint>Click the clock icon or type time</mat-hint>
</mat-form-field>
<ngx-mat-timepicker #picker/>`;

  readonly snippetThemingScss = `@use '@angular/material' as mat;
@use '@angular/cdk/overlay-prebuilt.css';
@use '@ngx-material/timepicker' as timepicker;

// 1. Define Angular Material 3 Themes (Light & Dark)
$light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$violet-palette,
    tertiary: mat.$rose-palette,
  ),
  typography: (
    plain-family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    brand-family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  ),
  density: (
    scale: 0,
  ),
));

$dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$violet-palette,
    tertiary: mat.$rose-palette,
  ),
));

// 2. Base setup
*, *::before, *::after {
  box-sizing: border-box;
}

// 3. Apply themes & Timepicker styles
html {
  @include mat.all-component-themes($light-theme);
  @include timepicker.theme();
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color-scheme: light dark;
}

html.dark-mode,
body.dark-mode {
  @include mat.all-component-colors($dark-theme);
}`;

  readonly playgroundPrimaryColor = computed(() => {
    return this.isDarkMode()
      ? this.activePreset().primaryDark
      : this.activePreset().primaryLight;
  });

  readonly playgroundContainerColor = computed(() => {
    return this.isDarkMode()
      ? this.activePreset().containerDark
      : this.activePreset().containerLight;
  });

  readonly generatedScssSnippet = computed(() => {
    const primary = this.playgroundPrimaryColor();
    const container = this.playgroundContainerColor();
    const radius = this.customRadius();

    return `@use '@ngx-material/timepicker' as timepicker;\n\n// Custom Material 3 Token Overrides\n@include timepicker.theme((\n  dial-pin: ${primary},\n  dial-hand: ${primary},\n  dial-handle-bg: ${primary},\n  time-box-selected-bg: ${container},\n  container-shape: ${radius}\n));`;
  });

  constructor() {
    // Default to dark mode matching Angular Material docs
    if (typeof document !== 'undefined') {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    }
  }

  // ---------------------------------------------------------------------------
  // UI Actions & Helpers
  // ---------------------------------------------------------------------------
  setTab(tab: DocTab): void {
    this.activeTab.set(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleTheme(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    if (typeof document !== 'undefined') {
      if (next) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    }
  }

  scrollToSection(sectionId: string): void {
    this.activeToc.set(sectionId);
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -120;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  selectThemePreset(preset: ThemePreset): void {
    this.activePreset.set(preset);
  }

  updateRadius(val: number): void {
    this.customRadiusNumber.set(val);
  }

  setStep(step: number): void {
    this.currentStep.set(step);
  }

  toggleCode(exampleId: string): void {
    const current = this.expandedCode();
    this.expandedCode.set({
      ...current,
      [exampleId]: !current[exampleId],
    });
  }

  setCodeTab(exampleId: string, tab: 'html' | 'ts' | 'css'): void {
    const current = this.activeCodeTab();
    this.activeCodeTab.set({
      ...current,
      [exampleId]: tab,
    });
  }

  isCodeExpanded(exampleId: string): boolean {
    return !!this.expandedCode()[exampleId];
  }

  getActiveCodeTab(exampleId: string): 'html' | 'ts' | 'css' {
    return this.activeCodeTab()[exampleId] || 'html';
  }

  copyNpmInstall(): void {
    this.copyToClipboard('npm i @ngx-material/timepicker', 'Install command');
    this.copiedNpm.set(true);
    setTimeout(() => this.copiedNpm.set(false), 2500);
  }

  copyToClipboard(text: string, label: string = 'Code'): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copyFeedback.set(`${label} copied to clipboard!`);
        setTimeout(() => {
          if (this.copyFeedback() === `${label} copied to clipboard!`) {
            this.copyFeedback.set(null);
          }
        }, 2500);
      });
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

      case 'ja-JP':
        this.intl.selectTimeLabel = '時間を選択';
        this.intl.enterTimeLabel = '時間を入力';
        this.intl.hourLabel = '時';
        this.intl.minuteLabel = '分';
        this.intl.amLabel = '午前';
        this.intl.pmLabel = '午後';
        this.intl.cancelLabel = 'キャンセル';
        this.intl.okLabel = '決定';
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

  onEmbeddedTimeChange(val: TimeValue): void {
    this.embeddedTime.set(val);
  }

  formatDateObject(date: Date | null): string {
    if (!date) return 'No date selected';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + date.toISOString() + ')';
  }
}

export { App as AppComponent };
