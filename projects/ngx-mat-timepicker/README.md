# ngx-material-timepicker

An enterprise-grade, accessible **Material Design 3 (M3) Time Picker** for Angular, matching official specifications from [Material 3 Time Pickers](https://m3.material.io/components/time-pickers/specs).

[![npm version](https://img.shields.io/npm/v/ngx-material-timepicker.svg)](https://www.npmjs.com/package/ngx-material-timepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **100% Material 3 Specification**: Built with official M3 color tokens, typography scales, corner shapes (`28dp` container radius), and elevation levels.
- **Dual Mode (Dial & Input)**:
  - **Clock Dial Mode**: Circular clock face with 8dp center pin, 2dp pointer arm, 48dp handle, and smooth drag/tap gestures.
  - **Text Input Mode**: Accessible keyboard-first numeric fields with validation and automatic focus advancement.
- **Angular Signal Forms Ready**: First-class support for modern `@angular/forms/signals` (`[formField]`), automatically dispatching native input and change events to synchronize signal models instantly.
- **Reactive & Template-driven Forms**: Seamless `ControlValueAccessor` implementation with `[formControl]` and `[(ngModel)]`.
- **Native JavaScript `Date` & Timezones**: Direct binding to native `Date` objects (`valueType="date"` and `(dateSet)` output) while preserving the date component and user timezone.
- **Angular Material Form Field Integration**: Direct drop-in with `<mat-form-field>` using `matIconSuffix` on `<ngx-mat-timepicker-toggle>`.
- **Professional Sass Theming**: Angular Material-style Sass module architecture with `@use 'ngx-material-timepicker' as timepicker;`, `@include timepicker.theme();`, and `@include timepicker.tokens(...)`.
- **Custom Overlay Styling**: Flexible `panelClass` input for targeted dialog overlay customizations.
- **12-Hour & 24-Hour Formats**:
  - 12h mode with vertical or horizontal AM/PM segmented toggle.
  - 24h mode with dual concentric rings (outer: 1–12, inner: 13–24/00).
- **Responsive Layouts**:
  - **Vertical (Portrait)** for mobile and standard modal dialogs.
  - **Horizontal (Landscape)** for tablets and widescreen viewports.
- **Enterprise Accessibility (WCAG 2.1 AA/AAA)**:
  - Full ARIA slider and dialog patterns (`role="dialog"`, `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`).
  - Full keyboard navigation (Arrow keys, PageUp/Down, Home/End).
  - CDK `CdkTrapFocus` focus locking and `LiveAnnouncer` screen reader voice prompts.
- **Internationalization (i18n) & RTL**:
  - Full bidirectional Right-to-Left (RTL) support (e.g. Arabic, Hebrew).
  - Injectable `NgxMatTimepickerIntl` service for customizable localized labels.

---

## 📦 Installation

```bash
npm install ngx-material-timepicker @angular/cdk
```

> [!NOTE]
> Ensure `@angular/cdk/overlay-prebuilt.css` or Angular Material is included in your global stylesheet so overlay styles render properly.

---

## 🎨 Sass Theming Setup

In your global `styles.scss`, configure your Angular Material 3 themes and include the `ngx-material-timepicker` theme:

```scss
@use '@angular/material' as mat;
@use '@angular/cdk/overlay-prebuilt.css';
@use 'ngx-material-timepicker' as timepicker;

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
}

// 4. Optional: Fine-grained token overrides
:root {
  @include timepicker.tokens((
    dial-hand: #f48fb1,
    dial-handle-bg: #f48fb1,
    time-box-selected-bg: #633b48,
    action-color: #f48fb1,
    container-shape: 20px
  ));
}
```

---

## 🚀 Usage Examples

### 1. Modern Angular Signal Forms (`@angular/forms/signals`)

```html
<mat-form-field appearance="outline">
  <mat-label>Select launch time</mat-label>
  <input 
    matInput 
    [formField]="bookingForm.launchTime" 
    [ngxMatTimepicker]="timePicker"
    placeholder="09:00 AM" 
  />
  <ngx-mat-timepicker-toggle matIconSuffix [for]="timePicker" />
  <ngx-mat-timepicker #timePicker />
</mat-form-field>

@if (bookingForm.launchTime().touched() && bookingForm.launchTime().errors().length) {
  <span class="error-msg">
    {{ bookingForm.launchTime().errors()[0].message }}
  </span>
}
```

```typescript
import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInput,
  NgxMatTimepickerToggle,
} from 'ngx-material-timepicker';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepicker,
    NgxMatTimepickerInput,
    NgxMatTimepickerToggle,
  ],
  templateUrl: './booking.html',
})
export class BookingComponent {
  readonly model = signal({ launchTime: '08:30 AM' });
  
  readonly bookingForm = form(this.model, (schema) => {
    required(schema.launchTime, { message: 'Launch time is required' });
  });
}
```

> [!IMPORTANT]
> **Material Form Field Suffix Requirement**: When placing `<ngx-mat-timepicker-toggle>` inside `<mat-form-field>`, always add the `matIconSuffix` attribute. Without `matIconSuffix`, the toggle projects inside the input infix container alongside the `<input>`, causing vertical layout distortion.

---

### 2. Reactive Forms (`FormControl`)

```html
<mat-form-field appearance="outline">
  <mat-label>Meeting time</mat-label>
  <input matInput [formControl]="timeControl" [ngxMatTimepicker]="picker" />
  <ngx-mat-timepicker-toggle matIconSuffix [for]="picker" />
  <ngx-mat-timepicker #picker />
</mat-form-field>
```

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInput,
  NgxMatTimepickerToggle,
} from 'ngx-material-timepicker';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepicker,
    NgxMatTimepickerInput,
    NgxMatTimepickerToggle,
  ],
  templateUrl: './reactive-example.html',
})
export class ReactiveExampleComponent {
  readonly timeControl = new FormControl('07:30 AM', [Validators.required]);
}
```

---

### 3. Native JavaScript `Date` Binding & Timezones

Bind directly to a native `Date` object by setting `valueType="date"`. The timepicker automatically updates the hour and minute portions while keeping the original calendar date and local timezone intact:

```html
<mat-form-field appearance="outline">
  <mat-label>Appointment date & time</mat-label>
  <input 
    matInput 
    [ngxMatTimepicker]="picker" 
    [formControl]="dateControl" 
    valueType="date" 
  />
  <ngx-mat-timepicker-toggle matIconSuffix [for]="picker" />
  <ngx-mat-timepicker #picker (dateSet)="onDateSet($event)" />
</mat-form-field>
```

---

### 4. 24-Hour Concentric Rings Dial

```html
<input [ngxMatTimepicker]="picker24" [formControl]="timeControl" />
<ngx-mat-timepicker-toggle matIconSuffix [for]="picker24" />
<ngx-mat-timepicker #picker24 [format]="24" />
```

---

### 5. Horizontal (Landscape) & Step Increments

```html
<ngx-mat-timepicker 
  #picker 
  [format]="12" 
  orientation="horizontal" 
  [stepMinute]="5" 
  [panelClass]="'custom-timepicker-overlay'" 
/>
```

---

## ⚙️ API Reference

### `<ngx-mat-timepicker>`

The popup overlay component containing the clock dials, text inputs, and action buttons.

| Input / Output | Type | Default | Description |
|---|---|---|---|
| `@Input() format` | `12 \| 24 \| '12h' \| '24h'` | `12` | Time format: 12-hour (with AM/PM) or 24-hour concentric dials. |
| `@Input() orientation` | `'auto' \| 'vertical' \| 'horizontal'` | `'auto'` | Layout orientation (vertical portrait or horizontal landscape). |
| `@Input() stepMinute` | `number` | `1` | Step interval for minute selection (e.g. 5, 10, 15). |
| `@Input() autoAdvance` | `boolean` | `true` | Whether selecting an hour automatically advances view to minutes. |
| `@Input() disabled` | `boolean` | `false` | Whether timepicker interaction is disabled. |
| `@Input() locale` | `string` | `'en-US'` | Active locale code for numbers and text parsing. |
| `@Input() panelClass` | `string \| string[]` | `''` | Custom CSS class or classes added to the overlay dialog panel. |
| `@Output() timeSet` | `EventEmitter<TimeValue>` | &mdash; | Emits when the user confirms a time value (`{ hour, minute, period }`). |
| `@Output() dateSet` | `EventEmitter<Date>` | &mdash; | Emits full JavaScript `Date` object when a time is confirmed. |
| `@Output() opened` | `EventEmitter<void>` | &mdash; | Emits when the timepicker overlay opens. |
| `@Output() closed` | `EventEmitter<void>` | &mdash; | Emits when the timepicker overlay closes. |

#### Methods

- `picker.open(initialValue?: TimeValue | string | Date)`: Opens the timepicker dialog.
- `picker.close()`: Closes the timepicker dialog.

---

### `[ngxMatTimepicker]` (Input Directive)

Directive applied to `<input>` elements to link them to a `<ngx-mat-timepicker>`.

| Input | Type | Default | Description |
|---|---|---|---|
| `@Input() ngxMatTimepicker` | `NgxMatTimepicker` | &mdash; | The timepicker instance that the input connects to. |
| `@Input() valueType` | `'string' \| 'date'` | `'string'` | Output format bound to the form control. |
| `@Input() min` | `string \| TimeValue \| Date` | &mdash; | The minimum allowed time boundary. |
| `@Input() max` | `string \| TimeValue \| Date` | &mdash; | The maximum allowed time boundary. |

---

### `<ngx-mat-timepicker-toggle>`

Component rendering the interactive clock toggle button.

| Input | Type | Default | Description |
|---|---|---|---|
| `@Input() for` | `NgxMatTimepicker` | &mdash; | The timepicker instance controlled by this toggle. |
| `@Input() disabled` | `boolean` | `false` | Whether the toggle button is disabled. |

---

### `NgxMatTimepickerIntl`

Injectable service providing internationalization for labels and tooltips.

| Property | Default Value | Description |
|---|---|---|
| `selectTimeLabel` | `'Select time'` | Title header in clock mode. |
| `enterTimeLabel` | `'Enter time'` | Title header in keyboard mode. |
| `hourLabel` | `'Hour'` | Subtitle under hour tile. |
| `minuteLabel` | `'Minute'` | Subtitle under minute tile. |
| `amLabel` | `'AM'` | AM segment button label. |
| `pmLabel` | `'PM'` | PM segment button label. |
| `cancelLabel` | `'Cancel'` | Action button to dismiss dialog. |
| `okLabel` | `'OK'` | Action button to confirm selection. |

---

## 🎯 CSS Custom Properties (Design Tokens)

All tokens have direct fallbacks to official Angular Material 3 `--mat-sys-*` tokens:

| Token Name | Light Theme Default | Dark Theme Default |
|---|---|---|
| `--ngx-mat-tp-container-bg` | `var(--mat-sys-surface-container-high, #ece6f0)` | `var(--mat-sys-surface-container-high, #2b2930)` |
| `--ngx-mat-tp-container-shape` | `28px` | `28px` |
| `--ngx-mat-tp-headline-color` | `var(--mat-sys-on-surface-variant, #49454f)` | `var(--mat-sys-on-surface-variant, #cac4d0)` |
| `--ngx-mat-tp-time-box-selected-bg` | `var(--mat-sys-primary-container, #eaddff)` | `var(--mat-sys-primary-container, #4f378b)` |
| `--ngx-mat-tp-time-box-selected-color` | `var(--mat-sys-on-primary-container, #21005d)` | `var(--mat-sys-on-primary-container, #eaddff)` |
| `--ngx-mat-tp-dial-bg` | `var(--mat-sys-surface-container-highest, #e6e0e9)` | `var(--mat-sys-surface-container-highest, #36343b)` |
| `--ngx-mat-tp-dial-pin` | `var(--mat-sys-primary, #6750a4)` | `var(--mat-sys-primary, #d0bcff)` |
| `--ngx-mat-tp-dial-hand` | `var(--mat-sys-primary, #6750a4)` | `var(--mat-sys-primary, #d0bcff)` |
| `--ngx-mat-tp-dial-handle-bg` | `var(--mat-sys-primary, #6750a4)` | `var(--mat-sys-primary, #d0bcff)` |
| `--ngx-mat-tp-dial-handle-color` | `var(--mat-sys-on-primary, #ffffff)` | `var(--mat-sys-on-primary, #381e72)` |
| `--ngx-mat-tp-action-color` | `var(--mat-sys-primary, #6750a4)` | `var(--mat-sys-primary, #d0bcff)` |

---

## 📄 License

MIT © [Subhrangsu Chowdhury](https://github.com/Subhrangsu90)
