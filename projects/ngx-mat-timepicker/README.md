# ngx-mat-timepicker

An enterprise-grade, accessible **Material Design 3 (M3) Time Picker** for Angular, matching official specifications from [Material 3 Time Pickers](https://m3.material.io/components/time-pickers/specs).

---

## ✨ Features

- **100% Material 3 Compliance**: Built with official M3 color roles, typography scales, corner shapes (`28dp` container radius), and elevation levels.
- **Dual Mode (Dial & Input)**:
  - **Clock Dial Mode**: Circular clock face with 8dp center pin, 2dp pointer arm, 48dp handle, and smooth drag/tap gestures.
  - **Text Input Mode**: Accessible keyboard-first numeric fields with validation and automatic focus advancement.
- **12-Hour & 24-Hour Formats**:
  - 12h mode with vertical or horizontal AM/PM segmented toggle.
  - 24h mode with dual concentric rings (outer: 1–12, inner: 13–24/00).
- **Responsive Layouts**:
  - **Vertical (Portrait)** for mobile and standard modal dialogs.
  - **Horizontal (Landscape)** for tablets and widescreen viewports.
- **Enterprise Accessibility (WCAG 2.1 AA/AAA)**:
  - ARIA slider and dialog patterns (`role="dialog"`, `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`).
  - Full keyboard navigation (Arrow keys, PageUp/Down, Home/End).
  - CDK `CdkTrapFocus` focus locking and `LiveAnnouncer` screen reader voice prompts.
- **Reactive Forms Integration**: Direct binding via `[formControl]` or `[(ngModel)]` using `[ngxMatTimepicker]="picker"`.

---

## 📦 Installation

```bash
npm install ngx-mat-timepicker @angular/cdk
```

---

## 🚀 Quick Start

### 1. In your Component Template

```html
<div class="time-field">
  <input 
    type="text" 
    [ngxMatTimepicker]="picker" 
    [formControl]="timeControl" 
    placeholder="Select time" 
  />
  <ngx-mat-timepicker-toggle [for]="picker" />
  <ngx-mat-timepicker #picker [format]="12" [orientation]="'auto'" />
</div>
```

### 2. In your Component TypeScript

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInputDirective,
  NgxMatTimepickerToggleComponent,
} from 'ngx-mat-timepicker';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxMatTimepicker,
    NgxMatTimepickerInputDirective,
    NgxMatTimepickerToggleComponent,
  ],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly timeControl = new FormControl('07:30 AM');
}
```

---

## ⚙️ API Reference

### `<ngx-mat-timepicker>`

| Input / Property | Type | Default | Description |
|---|---|---|---|
| `format` | `'12h' \| '24h' \| 12 \| 24` | `'12h'` | Time format format for display and selection. |
| `orientation` | `'vertical' \| 'horizontal' \| 'auto'` | `'auto'` | Layout orientation. `'auto'` detects viewport orientation. |
| `stepMinute` | `number` | `1` | Minute step interval on dial (e.g. 5 for 5-minute increments). |
| `autoAdvance` | `boolean` | `true` | Automatically advances from Hour to Minute after selection. |
| `cancelLabel` | `string` | `'Cancel'` | Custom label for dismiss action. |
| `okLabel` | `string` | `'OK'` | Custom label for confirm action. |
| `disabled` | `boolean` | `false` | Whether opening the time picker is disabled. |

| Output Event | Type | Description |
|---|---|---|
| `timeSet` | `TimeValue` | Emits the confirmed `{ hour, minute, period }` object. |
| `opened` | `void` | Emits when the modal dialog is opened. |
| `closed` | `void` | Emits when the modal dialog is closed. |

### Methods

- `picker.open(initialValue?: TimeValue | string | Date)`: Opens the time picker dialog.
- `picker.close()`: Closes the time picker dialog.

---

## 🎨 Theming

The component relies on standard Material 3 CSS custom properties with automatic fallbacks:

```scss
:root {
  --ngx-mat-tp-container-bg: var(--mat-sys-surface-container-high, #ece6f0);
  --ngx-mat-tp-dial-bg: var(--mat-sys-surface-container-highest, #e6e0e9);
  --ngx-mat-tp-dial-pin: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-dial-hand: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-dial-handle-bg: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-time-box-selected-bg: var(--mat-sys-primary-container, #eaddff);
  --ngx-mat-tp-time-box-selected-color: var(--mat-sys-on-primary-container, #21005d);
}
```

Dark mode is supported out of the box with class `.dark-theme` or `[data-theme='dark']`.
