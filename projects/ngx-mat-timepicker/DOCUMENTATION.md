# Material Design 3 Time Picker (`ngx-mat-timepicker`) — Full Documentation

An enterprise-grade, accessible **Material Design 3 (M3) Time Picker** for Angular, engineered to match the official specifications from [Material 3 Time Pickers](https://m3.material.io/components/time-pickers/specs).

---

## Table of Contents
1. [Overview](#1-overview)
2. [Installation & Setup](#2-installation--setup)
3. [Quick Start](#3-quick-start)
4. [API Reference](#4-api-reference)
   - [NgxMatTimepicker (`<ngx-mat-timepicker>`)](#ngx-mat-timepicker)
   - [NgxMatTimepickerInputDirective (`input[ngxMatTimepicker]`)](#ngxmattimepickerinputdirective)
   - [NgxMatTimepickerToggleComponent (`<ngx-mat-timepicker-toggle>`)](#ngxmattimepickertogglecomponent)
   - [NgxMatTimepickerDialogComponent (`<ngx-mat-timepicker-dialog>`)](#ngxmattimepickerdialogcomponent)
   - [Services](#services)
   - [TypeScript Interfaces & Types](#typescript-interfaces--types)
5. [Layouts & Formats](#5-layouts--formats)
   - [12-Hour vs. 24-Hour Modes](#12-hour-vs-24-hour-modes)
   - [Vertical vs. Horizontal Orientations](#vertical-vs-horizontal-orientations)
   - [Dial Mode vs. Text Input Mode](#dial-mode-vs-text-input-mode)
6. [Accessibility & Keyboard Navigation](#6-accessibility--keyboard-navigation)
7. [Theming & CSS Variables](#7-theming--css-variables)
8. [Code Recipes & Advanced Examples](#8-code-recipes--advanced-examples)

---

## 1. Overview

The `ngx-mat-timepicker` library provides a native Angular implementation of the Material 3 Time Picker component:
- **100% Material 3 Geometry**: Standard `256dp` clock dial, `48dp` selector handle, `8dp` center pin, `2dp` arm line, and `28dp` (`corner-extra-large`) dialog corners.
- **Dual Modality**: Smooth drag-and-snap analog clock dial and accessible fallback numeric text fields.
- **Signal-Powered Reactivity**: Built with Angular Signals (`signal()`, `computed()`, `input()`, `output()`) and modern control flow (`@if`, `@for`, `@switch`).
- **Angular CDK Powered**: Utilizes `@angular/cdk/overlay` for modal backdrop and screen position strategy, `@angular/cdk/a11y` for focus trapping (`cdkTrapFocus`) and live screen reader updates (`LiveAnnouncer`).

---

## 2. Installation & Setup

### 1. Install Dependencies
```bash
npm install ngx-mat-timepicker @angular/cdk @angular/forms @angular/animations
```

### 2. Include CDK Overlay Styles
In your global stylesheet (`src/styles.scss`):
```scss
@use '@angular/cdk/overlay-prebuilt.css';
@use 'ngx-mat-timepicker/themes/timepicker';
```

### 3. Provide Async Animations
In your `app.config.ts`:
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
  ],
};
```

---

## 3. Quick Start

### Standalone Component Integration

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInputDirective,
  NgxMatTimepickerToggleComponent,
} from 'ngx-mat-timepicker';

@Component({
  selector: 'app-time-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxMatTimepicker,
    NgxMatTimepickerInputDirective,
    NgxMatTimepickerToggleComponent,
  ],
  template: `
    <div class="time-field-wrapper">
      <input
        type="text"
        [ngxMatTimepicker]="picker"
        [formControl]="meetingTime"
        placeholder="Select time"
      />
      <ngx-mat-timepicker-toggle [for]="picker" />
      <ngx-mat-timepicker #picker [format]="12" />
    </div>
  `,
  styles: `
    .time-field-wrapper {
      display: inline-flex;
      align-items: center;
      border: 1px solid #79747e;
      border-radius: 8px;
      padding: 0 8px;
    }
    input {
      border: none;
      outline: none;
      height: 48px;
      font-size: 16px;
    }
  `,
})
export class TimeDemoComponent {
  readonly meetingTime = new FormControl('07:00 AM');
}
```

---

## 4. API Reference

### `<ngx-mat-timepicker>`

The orchestrator component that controls the dialog overlay.

#### Inputs
| Property | Type | Default | Description |
|---|---|---|---|
| `format` | `'12h' \| '24h' \| 12 \| 24` | `'12h'` | The time format. When `12`, shows 1–12 with AM/PM toggle. When `24`, renders dual concentric rings without AM/PM. |
| `orientation` | `'vertical' \| 'horizontal' \| 'auto'` | `'auto'` | Layout orientation. `'auto'` detects viewport orientation via `matchMedia`. |
| `stepMinute` | `number` | `1` | Interval between selectable minutes (e.g. `5` for 5-minute intervals). |
| `autoAdvance` | `boolean` | `true` | Automatically transitions from Hour selection to Minute selection upon pointer release. |
| `cancelLabel` | `string` | `'Cancel'` | Custom label for dismiss button. |
| `okLabel` | `string` | `'OK'` | Custom label for confirm button. |
| `disabled` | `boolean` | `false` | When true, prevents opening the dialog. |

#### Outputs
| Event | Type | Description |
|---|---|---|
| `timeSet` | `OutputEmitterRef<TimeValue>` | Emitted when user confirms time selection with OK. |
| `opened` | `OutputEmitterRef<void>` | Emitted when dialog overlay is displayed. |
| `closed` | `OutputEmitterRef<void>` | Emitted when dialog overlay is dismissed. |

#### Methods
| Method | Arguments | Description |
|---|---|---|
| `open()` | `initialValue?: TimeValue \| string \| Date` | Opens the modal timepicker dialog. |
| `close()` | — | Closes the modal timepicker dialog. |

---

### `input[ngxMatTimepicker]`

Directive applied to `<input>` fields to connect with `<ngx-mat-timepicker>`. Implements Angular's `ControlValueAccessor`.

#### Inputs
| Property | Type | Required | Description |
|---|---|---|---|
| `ngxMatTimepicker` | `NgxMatTimepicker` | **Yes** | Reference to the `<ngx-mat-timepicker>` component instance. |

#### Outputs
| Event | Type | Description |
|---|---|---|
| `timeChange` | `OutputEmitterRef<string>` | Emitted when input value changes. |

---

### `<ngx-mat-timepicker-toggle>`

Trigger button that opens the associated timepicker dialog.

#### Inputs
| Property | Type | Required | Description |
|---|---|---|---|
| `for` | `NgxMatTimepicker` | **Yes** | The timepicker instance to open on click. |
| `disabled` | `boolean` | No (Default: `false`) | Disables the toggle button. |

---

### `<ngx-mat-timepicker-dialog>`

The modal dialog content component. Can be used **directly** in your templates for inline / embedded time selection without a modal overlay.

#### Inputs
| Property | Type | Default | Description |
|---|---|---|---|
| `initialTime` | `TimeValue \| string \| Date \| null` | `null` | Pre-selected time value. |
| `format` | `TimeFormat` | `'12h'` | Display format (`'12h'` or `'24h'`). |
| `orientation` | `TimePickerOrientation` | `'auto'` | Layout orientation (`'vertical'` or `'horizontal'`). |
| `stepMinute` | `number` | `1` | Minute step interval. |
| `autoAdvance` | `boolean` | `true` | Auto transition to minute step. |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label. |
| `okLabel` | `string` | `'OK'` | OK button label. |

#### Outputs
| Event | Type | Description |
|---|---|---|
| `timeSet` | `OutputEmitterRef<TimeValue>` | Emitted with confirmed `{ hour, minute, period }`. |
| `dialogClosed` | `OutputEmitterRef<void>` | Emitted when cancelled or confirmed. |

---

### Services

#### `TimepickerAdapterService`
Utility service providing mathematical time calculations:
- `normalizeFormat(format: TimeFormat): 12 | 24`
- `parse(value: string | Date | TimeValue, format: 12 | 24): TimeValue`
- `format(time: TimeValue, format: 12 | 24): string`
- `toMinutesOfDay(time: TimeValue, format: 12 | 24): number`
- `isWithinRange(time: TimeValue, format: 12 | 24, min?, max?): boolean`
- `to12Hour(hour24: number): { hour: number; period: Period }`
- `to24Hour(hour12: number, period: Period): number`

#### `TimepickerA11yService`
Handles screen reader announcements and standardized keyboard event translations:
- `announceStep(step: TimePickerStep): void`
- `announceSelection(step: TimePickerStep, value: number, period?: string): void`
- `handleStepKeyboardNav(event, currentVal, step, format, stepMinute): number | null`

---

### TypeScript Interfaces & Types

```typescript
export type TimeFormat = '12h' | '24h' | 12 | 24;
export type TimePickerMode = 'dial' | 'input';
export type TimePickerOrientation = 'vertical' | 'horizontal' | 'auto';
export type TimePickerStep = 'hour' | 'minute';
export type Period = 'AM' | 'PM';

export interface TimeValue {
  hour: number;
  minute: number;
  period?: Period;
}

export interface TimepickerConfig {
  format?: TimeFormat;
  orientation?: TimePickerOrientation;
  mode?: TimePickerMode;
  min?: string | Date;
  max?: string | Date;
  stepMinute?: number;
  autoAdvance?: boolean;
  cancelLabel?: string;
  okLabel?: string;
  disabled?: boolean;
}
```

---

## 5. Layouts & Formats

### 12-Hour vs. 24-Hour Modes
- **12-Hour Mode (`format="12"`)**:
  - Displays hours 1 to 12 on the outer dial perimeter.
  - Accompanied by a segmented `AM` / `PM` toggle.
  - Returns formatted string e.g. `"07:30 AM"`.
- **24-Hour Mode (`format="24"`)**:
  - Displays dual concentric rings: **Outer ring** (1–12) at $r = 100\text{dp}$; **Inner ring** (13–24/00) at $r = 68\text{dp}$.
  - The selector handle automatically adapts length based on whether outer or inner ring is selected.
  - Returns formatted string e.g. `"19:30"`.

### Vertical vs. Horizontal Orientations
- **Vertical (`orientation="vertical"`)**:
  - Mobile/portrait layout: Time display on top, clock dial centered below, action bar at bottom.
  - AM/PM toggle is vertically stacked beside the time display (`52×80dp`).
- **Horizontal (`orientation="horizontal"`)**:
  - Tablet/landscape layout: Side-by-side columns.
  - Left column: Time display with horizontal AM/PM toggle below (`216×40dp`).
  - Right column: Clock dial.

### Dial Mode vs. Text Input Mode
- Users can click the **keyboard icon** (⌨) in the bottom-left corner at any time to toggle to **Text Input mode** ("Enter time").
- Text inputs provide two 2-digit numeric fields for Hour and Minute with automatic focus advancement.
- Clicking the **clock icon** (🕒) returns to the dial view without losing state.

---

## 6. Accessibility & Keyboard Navigation

The component is compliant with **WCAG 2.1 AA and AAA** guidelines:

### Keyboard Shortcuts
| Key | Context | Action |
|---|---|---|
| <kbd>Arrow Up</kbd> / <kbd>Arrow Right</kbd> | Dial / Display | Increment hour (+1) or minute (+stepMinute). Wraps around boundaries. |
| <kbd>Arrow Down</kbd> / <kbd>Arrow Left</kbd> | Dial / Display | Decrement hour (-1) or minute (-stepMinute). |
| <kbd>Page Up</kbd> | Dial / Display | Increment minutes by 5 or hours by 2–3. |
| <kbd>Page Down</kbd> | Dial / Display | Decrement minutes by 5 or hours by 2–3. |
| <kbd>Home</kbd> | Dial / Display | Jump to minimum value (1 or 0). |
| <kbd>End</kbd> | Dial / Display | Jump to maximum value (12, 23, or 59). |
| <kbd>Escape</kbd> | Dialog | Dismiss dialog without applying changes. |
| <kbd>Tab</kbd> | Dialog | Traps focus within modal using CDK `cdkTrapFocus`. |

### Screen Reader Support
- Clock dial implements `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext` (e.g. *"07 o'clock AM"*).
- Dialog has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Step switches trigger polite announcements via `TimepickerA11yService`.

---

## 7. Theming & CSS Variables

The library is styled using Material 3 CSS Custom Properties:

```scss
:root {
  /* Container & Surface */
  --ngx-mat-tp-container-bg: var(--mat-sys-surface-container-high, #ece6f0);
  --ngx-mat-tp-container-shape: 28px;
  --ngx-mat-tp-headline-color: var(--mat-sys-on-surface-variant, #49454f);

  /* Time Display Boxes */
  --ngx-mat-tp-time-box-selected-bg: var(--mat-sys-primary-container, #eaddff);
  --ngx-mat-tp-time-box-selected-color: var(--mat-sys-on-primary-container, #21005d);
  --ngx-mat-tp-time-box-unselected-bg: var(--mat-sys-surface-container-highest, #e6e0e9);
  --ngx-mat-tp-time-box-unselected-color: var(--mat-sys-on-surface, #1d1b20);
  --ngx-mat-tp-separator-color: var(--mat-sys-on-surface, #1d1b20);

  /* AM / PM Toggle */
  --ngx-mat-tp-period-selected-bg: var(--mat-sys-tertiary-container, #ffd8e4);
  --ngx-mat-tp-period-selected-color: var(--mat-sys-on-tertiary-container, #31111d);
  --ngx-mat-tp-period-unselected-color: var(--mat-sys-on-surface-variant, #49454f);
  --ngx-mat-tp-period-border: var(--mat-sys-outline, #79747e);

  /* Clock Dial */
  --ngx-mat-tp-dial-bg: var(--mat-sys-surface-container-highest, #e6e0e9);
  --ngx-mat-tp-dial-pin: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-dial-hand: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-dial-handle-bg: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-dial-handle-color: var(--mat-sys-on-primary, #ffffff);
  --ngx-mat-tp-dial-number-color: var(--mat-sys-on-surface, #1d1b20);

  /* Actions & Validation */
  --ngx-mat-tp-action-color: var(--mat-sys-primary, #6750a4);
  --ngx-mat-tp-action-icon: var(--mat-sys-on-surface-variant, #49454f);
  --ngx-mat-tp-error-color: var(--mat-sys-error, #b3261e);
}
```

Dark mode is automatically applied when the `.dark-theme` or `[data-theme='dark']` class is present on any parent element or `<body>`.

---

## 8. Code Recipes & Advanced Examples

### Recipe 1: 24-Hour Military Format with Reactive Validation
```typescript
import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInputDirective,
  NgxMatTimepickerToggleComponent,
} from 'ngx-mat-timepicker';

@Component({
  selector: 'app-shift-picker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxMatTimepicker,
    NgxMatTimepickerInputDirective,
    NgxMatTimepickerToggleComponent,
  ],
  template: `
    <div class="field">
      <input [ngxMatTimepicker]="shiftPicker" [formControl]="shiftControl" />
      <ngx-mat-timepicker-toggle [for]="shiftPicker" />
      <ngx-mat-timepicker #shiftPicker [format]="24" />
    </div>
    @if (shiftControl.invalid) {
      <span class="error">Shift time is required</span>
    }
  `,
})
export class ShiftPickerComponent {
  readonly shiftControl = new FormControl('18:00', Validators.required);
}
```

### Recipe 2: 15-Minute Snapping with Custom Action Labels
```html
<input [ngxMatTimepicker]="meetingPicker" [formControl]="meetingControl" />
<ngx-mat-timepicker-toggle [for]="meetingPicker" />

<ngx-mat-timepicker
  #meetingPicker
  [format]="12"
  [stepMinute]="15"
  cancelLabel="Discard"
  okLabel="Set Meeting"
  (timeSet)="onMeetingConfirmed($event)"
/>
```

### Recipe 3: Inline Embedded Dialog (No Modal Overlay)
```html
<ngx-mat-timepicker-dialog
  [initialTime]="timeModel"
  [format]="12"
  orientation="horizontal"
  (timeSet)="onInlineTimeSet($event)"
/>
```

### Recipe 4: Programmatic Opening via Button
```html
<button type="button" (click)="picker.open('08:45 AM')">
  Set Alarm
</button>
<ngx-mat-timepicker #picker [format]="12" (timeSet)="saveAlarm($event)" />
```
