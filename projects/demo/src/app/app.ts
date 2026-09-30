import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

export type DocTab = 'overview' | 'api' | 'styling' | 'examples';

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

  // Active Top Navigation Tab
  readonly activeTab = signal<DocTab>('overview');

  // Dark/Light Theme state (Default dark to match official Angular Material doc)
  readonly isDarkMode = signal<boolean>(true);

  // Active TOC Anchor
  readonly activeToc = signal<string>('connecting');

  // Code snippets expansion state per example ID
  readonly expandedCode = signal<Record<string, boolean>>({});

  // Active code tab ('html' | 'ts' | 'css') per example ID
  readonly activeCodeTab = signal<Record<string, 'html' | 'ts' | 'css'>>({});

  // Copied feedback message
  readonly copyFeedback = signal<string | null>(null);

  // Styling Tab: Live Theme Playground
  readonly customPrimaryColor = signal<string>('#f48fb1');
  readonly customContainerColor = signal<string>('#633b48');
  readonly customRadius = signal<string>('28px');

  setThemeColor(color: string): void {
    this.customPrimaryColor.set(color);
    switch (color) {
      case '#f48fb1':
        this.customContainerColor.set('#633b48');
        break;
      case '#29b6f6':
        this.customContainerColor.set('#004a77');
        break;
      case '#66bb6a':
        this.customContainerColor.set('#005324');
        break;
      case '#ffa726':
        this.customContainerColor.set('#6e3900');
        break;
      default: // #6750a4
        this.customContainerColor.set('#4f378b');
        break;
    }
  }

  // Form Controls for Examples
  readonly basicTimeControl = new FormControl('07:00 AM');
  readonly time12hControl = new FormControl('07:00 AM');
  readonly time24hControl = new FormControl('20:00');
  readonly timeLandscapeControl = new FormControl('07:30 AM');
  readonly timeStep5Control = new FormControl('09:15 AM');
  readonly timeRequiredControl = new FormControl('10:30 AM', [Validators.required]);
  readonly timeDateControl = new FormControl<Date | null>(new Date(2026, 8, 30, 14, 30, 0));
  readonly timeLocaleControl = new FormControl('03:30 PM');

  // i18n & RTL State
  readonly selectedLocale = signal<string>('es-ES');
  readonly isRtl = signal<boolean>(false);

  // Events & Results
  readonly lastTimeSetEvent = signal<string>('07:00 AM');
  readonly lastDateSetEvent = signal<string>('');

  // Embedded Dialog State
  readonly embeddedTime = signal<TimeValue>({ hour: 7, minute: 0, period: 'AM' });
  readonly embeddedFormat = signal<TimeFormat>('12h');

  // Code Snippets for Copying
  readonly snippetBasicHtml = `<div class="field-container">\n  <input matInput [ngxMatTimepicker]="picker" [formControl]="timeControl" placeholder="Pick a time">\n  <ngx-mat-timepicker-toggle matIconSuffix [for]="picker"/>\n</div>\n<ngx-mat-timepicker #picker/>`;
  readonly snippetBasicTs = `import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { NgxMatTimepicker, NgxMatTimepickerInput, NgxMatTimepickerToggle } from 'ngx-mat-timepicker';\n\n@Component({\n  selector: 'basic-timepicker-example',\n  standalone: true,\n  imports: [ReactiveFormsModule, NgxMatTimepicker, NgxMatTimepickerInput, NgxMatTimepickerToggle],\n  templateUrl: './basic-timepicker.html',\n})\nexport class BasicTimepickerExample {\n  readonly timeControl = new FormControl('07:00 AM');\n}`;
  readonly snippetBasicCss = `.field-container {\n  display: flex;\n  align-items: center;\n  max-width: 320px;\n  border: 1px solid #49454f;\n  border-radius: 8px;\n  background: #1d1b20;\n}`;
  readonly snippetConnectingHtml = `<input matInput [ngxMatTimepicker]="picker">\n<ngx-mat-timepicker-toggle matIconSuffix [for]="picker"/>\n<ngx-mat-timepicker #picker/>`;
  readonly snippetFormsTs = `readonly timeControl = new FormControl('07:00 AM', [Validators.required]);\n\nonSave(): void {\n  if (this.timeControl.valid) {\n    console.log('Selected Time:', this.timeControl.value);\n  }\n}`;
  readonly snippetDateHtml = `<input [ngxMatTimepicker]="picker" [formControl]="dateControl" valueType="date">\n<ngx-mat-timepicker-toggle [for]="picker"/>\n<ngx-mat-timepicker #picker (dateSet)="onDateChange($event)"/>`;
  readonly snippetApiImport = `import {\n  NgxMatTimepicker,\n  NgxMatTimepickerInput,\n  NgxMatTimepickerToggle,\n  NgxMatTimepickerDialog,\n  NgxMatTimepickerIntl\n} from 'ngx-mat-timepicker';`;

  constructor() {
    // Default to dark mode matching material.angular.dev
    document.body.classList.add('dark-mode');
    this.setLocale('es-ES');
  }

  setTab(tab: DocTab): void {
    this.activeTab.set(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  scrollToSection(sectionId: string): void {
    this.activeToc.set(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
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

  copyToClipboard(text: string, label: string = 'Code'): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copyFeedback.set(`${label} copied!`);
      setTimeout(() => {
        if (this.copyFeedback() === `${label} copied!`) {
          this.copyFeedback.set(null);
        }
      }, 2500);
    });
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
