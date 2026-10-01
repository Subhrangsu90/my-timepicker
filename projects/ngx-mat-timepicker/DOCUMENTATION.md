# Material Design 3 Time Picker (`ngx-mat-timepicker`) — Full Documentation

An enterprise-grade, accessible **Material Design 3 (M3) Time Picker** for Angular, engineered to match the official specifications from [Material 3 Time Pickers](https://m3.material.io/components/time-pickers/specs).

---

## Table of Contents
1. [Overview](#1-overview)
2. [Installation & Setup](#2-installation--setup)
3. [Quick Start](#3-quick-start)
   - [Angular Signal Forms (`@angular/forms/signals`)](#angular-signal-forms-angularformssignals)
   - [Angular Material `<mat-form-field>` Integration](#integration-with-angular-material-mat-form-field)
   - [Reactive Forms (`FormControl`)](#reactive-forms-formcontrol)
4. [API Reference](#4-api-reference)
   - [NgxMatTimepicker (`<ngx-mat-timepicker>`)](#ngxmattimepicker)
   - [NgxMatTimepickerInput (`input[ngxMatTimepicker]`)](#ngxmattimepickerinput)
   - [NgxMatTimepickerToggle (`<ngx-mat-timepicker-toggle>`)](#ngxmattimepickertoggle)
   - [NgxMatTimepickerDialog (`<ngx-mat-timepicker-dialog>`)](#ngxmattimepickerdialog)
   - [Services & i18n](#services--internationalization)
   - [TypeScript Interfaces & Types](#typescript-interfaces--types)
5. [Layouts & Formats](#5-layouts--formats)
   - [12-Hour vs. 24-Hour Modes](#12-hour-vs-24-hour-modes)
   - [Vertical vs. Horizontal Orientations](#vertical-vs-horizontal-orientations)
   - [Simultaneous Dial & Keyboard Input](#simultaneous-keyboard--touch-interaction)
6. [Accessibility & Keyboard Navigation](#6-accessibility--keyboard-navigation)
7. [Theming & Sass Tokens](#7-theming--sass-tokens)
8. [Code Recipes & Advanced Examples](#8-code-recipes--advanced-examples)

---

## 1. Overview

The `ngx-mat-timepicker` library provides a modern Angular Material 3 implementation of the Time Picker component:
- **100% Material 3 Geometry**: Standard `256dp` clock dial, `48dp` selector handle, `8dp` center pin, `2dp` arm line, and `28dp` (`corner-extra-large`) dialog corners.
- **Dual Modality**: Smooth drag-and-snap analog clock dial and accessible fallback numeric text fields.
- **Angular Signal Forms Support**: First-class support for `@angular/forms/signals` with `[formField]`, automatically dispatching native `input` and `change` events upon selection to keep signals in sync.
- **Signal-Powered Reactivity**: Built with Angular Signals (`signal()`, `computed()`, `input()`, `output()`) and modern control flow (`@if`, `@for`, `@switch`).
- **Angular CDK Powered**: Utilizes `@angular/cdk/overlay` for modal backdrop and screen positioning, `@angular/cdk/a11y` for focus trapping (`cdkTrapFocus`) and live screen reader updates (`LiveAnnouncer`).
- **Professional Sass Theming**: Clean Angular Material-style Sass module architecture (`@use 'ngx-mat-timepicker' as timepicker;`).

---

## 2. Installation & Setup

### 1. Install Dependencies
```bash
npm install ngx-mat-timepicker @angular/cdk
```

### 2. Include CDK Overlay & Timepicker Theme Styles
In your global stylesheet (`src/styles.scss`):
```scss
@use '@angular/material' as mat;
@use 'ngx-mat-timepicker' as timepicker;

// Include default Material 3 timepicker styles
@include timepicker.theme();
```

> [!NOTE]
> If you are not using `@angular/material` in your project, ensure `@angular/cdk/overlay-prebuilt.css` is imported in `styles.scss` so overlay backdrop and panel styles render properly.

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

### Angular Signal Forms (`@angular/forms/signals`)

The timepicker input dispatches native `input` and `change` DOM events upon user selection or keyboard entry, providing seamless two-way reactivity with Angular Signal Forms:

```html
<mat-form-field appearance="outline">
  <mat-label>Launch time</mat-label>
  <input
    matInput
    [formField]="bookingForm.launchTime"
    [ngxMatTimepicker]="timePicker"
    placeholder="Select launch time"
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
} from 'ngx-mat-timepicker';

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

---

### Integration with Angular Material `<mat-form-field>`

You can use the timepicker directly inside an Angular Material `<mat-form-field>` with `matInput` and `matIconSuffix`:

```html
<mat-form-field appearance="outline">
  <mat-label>Pick a time</mat-label>
  <input matInput [ngxMatTimepicker]="picker" [formControl]="meetingTime" />
  <ngx-mat-timepicker-toggle matIconSuffix [for]="picker" />
  <ngx-mat-timepicker #picker [format]="12" />
</mat-form-field>
```

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInput,
  NgxMatTimepickerToggle,
} from 'ngx-mat-timepicker';

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
  templateUrl: './time-field.html',
})
export class TimeFieldComponent {
  readonly meetingTime = new FormControl('07:00 AM');
}
```

> [!IMPORTANT]
> **Always apply `matIconSuffix`**: Inside `<mat-form-field>`, custom components like `<ngx-mat-timepicker-toggle>` will project into the `<div class="mat-mdc-form-field-infix">` alongside the input unless decorated with `matIconSuffix` or `matSuffix`. Omitting `matIconSuffix` stretches the form field outline vertically and pushes the toggle underneath the text.

---

### Reactive Forms (`FormControl`)

```html
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
```

---

## 4. API Reference

### `NgxMatTimepicker`

The popup component that orchestrates the dialog overlay and clock presentation.

- **Selector**: `ngx-mat-timepicker`
- **Export As**: `ngxMatTimepicker`

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
| `locale` | `string` | `'en-US'` | Active locale string for number formatting and localization. |
| `panelClass` | `string \| string[]` | `''` | Extra CSS class or list of classes to append to the overlay dialog panel. |

#### Outputs
| Event | Type | Description |
|---|---|---|
| `timeSet` | `OutputEmitterRef<TimeValue>` | Emitted when user confirms time selection with OK (`{ hour, minute, period }`). |
| `dateSet` | `OutputEmitterRef<Date>` | Emitted when user confirms time selection, returning a native JavaScript `Date` instance with local timezone (e.g. `00:00:00 GMT+0530`). |
| `opened` | `OutputEmitterRef<void>` | Emitted when dialog overlay is displayed. |
| `closed` | `OutputEmitterRef<void>` | Emitted when dialog overlay is dismissed. |

#### Methods
| Method | Arguments | Description |
|---|---|---|
| `open()` | `initialValue?: TimeValue \| string \| Date` | Opens the modal timepicker dialog. |
| `close()` | — | Closes the modal timepicker dialog. |

---

### `NgxMatTimepickerInput`

Directive applied to `<input>` fields to connect with `<ngx-mat-timepicker>`. Implements Angular's `ControlValueAccessor` and dispatches native DOM `input` and `change` events.

- **Selector**: `input[ngxMatTimepicker]`

#### Inputs
| Property | Type | Default | Description |
|---|---|---|---|
| `ngxMatTimepicker` | `NgxMatTimepicker` | &mdash; (**Required**) | Reference to the `<ngx-mat-timepicker>` component instance. |
| `valueType` | `'string' \| 'date'` | `'string'` | Determines the model format bound to `FormControl`, `ngModel`, or Signal Forms. If `'date'`, preserves the date portion and user timezone. |
| `min` | `string \| TimeValue \| Date` | &mdash; | Minimum selectable boundary. |
| `max` | `string \| TimeValue \| Date` | &mdash; | Maximum selectable boundary. |

#### Outputs
| Event | Type | Description |
|---|---|---|
| `timeChange` | `OutputEmitterRef<string>` | Emitted when input value changes (formatted string). |
| `dateChange` | `OutputEmitterRef<Date>` | Emitted when a time is selected, returning a native JavaScript `Date` object. |

---

### `NgxMatTimepickerToggle`

Trigger button that opens the associated timepicker dialog.

- **Selector**: `ngx-mat-timepicker-toggle`

#### Inputs
| Property | Type | Default | Description |
|---|---|---|---|
| `for` | `NgxMatTimepicker` | &mdash; (**Required**) | The timepicker instance to open on click. |
| `disabled` | `boolean` | `false` | Disables the toggle button. |

---

### `NgxMatTimepickerDialog`

The modal dialog content component. Can be used **directly** in your templates for inline / embedded time selection without a modal overlay.

- **Selector**: `ngx-mat-timepicker-dialog`

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

### Services & Internationalization

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

#### `NgxMatTimepickerIntl`
Configurable internationalization provider for all user-facing labels and screen reader announcements:
- `selectTimeLabel`: Header in dial mode (default: `'Select time'`)
- `enterTimeLabel`: Header in input mode (default: `'Enter time'`)
- `hourLabel`: Label under hour input (default: `'Hour'`)
- `minuteLabel`: Label under minute input (default: `'Minute'`)
- `amLabel`: Localized AM indicator (default: `'AM'`)
- `pmLabel`: Localized PM indicator (default: `'PM'`)
- `cancelLabel`: Cancel button text (default: `'Cancel'`)
- `okLabel`: OK button text (default: `'OK'`)
- `changes: Subject<void>`: Trigger to notify all active pickers of runtime translations.

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
  panelClass?: string | string[];
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

### Simultaneous Keyboard & Touch Interaction
- **Always Editable Display Boxes**: The Hour and Minute boxes on the clock dial screen are active numeric `<input>` fields at all times. Users do not have to switch modes to type on their keyboard or virtual keypad.
- **Instant Two-Way Synchronization**:
  - Typing digits into the Hour or Minute box moves the analog clock dial hand in real-time.
  - Touching or dragging the analog clock dial updates the numeric input values immediately.
- **Smart Auto-Advance & Navigation**:
  - Typing 2 digits (or a single complete digit in 12h/24h mode) automatically advances focus to the Minute box.
  - <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd> cycles through hours and minutes with boundaries wrapping around.
  - <kbd>Arrow Left</kbd> / <kbd>Arrow Right</kbd> or <kbd>Backspace</kbd> moves cursor seamlessly between Hour and Minute fields.
- **Text-Only Compact Mode**: Clicking the **keyboard icon** (⌨) in the bottom-left corner collapses the dialog into an ultra-compact layout by hiding the clock dial.

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

## 7. Theming & Sass Tokens

### Angular Material-Style Sass Module

In your `styles.scss`:

```scss
@use '@angular/material' as mat;
@use 'ngx-mat-timepicker' as timepicker;

// 1. Emit standard Material 3 theme & overlay styles
@include timepicker.theme();

// 2. Optional: Custom palette token overrides
:root {
  @include timepicker.tokens((
    dial-hand: #f48fb1,
    dial-handle-bg: #f48fb1,
    time-box-selected-bg: #633b48,
    action-color: #f48fb1,
    container-shape: 20px
  ));
}

.dark-theme, [data-theme='dark'] {
  @include timepicker.tokens((
    container-bg: #1e1b24,
    dial-bg: #2b2832
  ));
}
```

### CSS Custom Properties Reference

All tokens fall back cleanly to official Material 3 `--mat-sys-*` tokens:

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

---

## 8. Code Recipes & Advanced Examples

### Recipe 1: 24-Hour Format with Reactive Validation
```typescript
import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NgxMatTimepicker,
  NgxMatTimepickerInput,
  NgxMatTimepickerToggle,
} from 'ngx-mat-timepicker';

@Component({
  selector: 'app-shift-picker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepicker,
    NgxMatTimepickerInput,
    NgxMatTimepickerToggle,
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Shift start time</mat-label>
      <input matInput [ngxMatTimepicker]="shiftPicker" [formControl]="shiftControl" />
      <ngx-mat-timepicker-toggle matIconSuffix [for]="shiftPicker" />
      <ngx-mat-timepicker #shiftPicker [format]="24" />
    </mat-form-field>
    @if (shiftControl.invalid) {
      <span class="error">Shift time is required</span>
    }
  `,
})
export class ShiftPickerComponent {
  readonly shiftControl = new FormControl('18:00', Validators.required);
}
```

### Recipe 2: 15-Minute Snapping with Custom Action Labels & Custom Panel Class
```html
<input [ngxMatTimepicker]="meetingPicker" [formControl]="meetingControl" />
<ngx-mat-timepicker-toggle matIconSuffix [for]="meetingPicker" />

<ngx-mat-timepicker
  #meetingPicker
  [format]="12"
  [stepMinute]="15"
  [panelClass]="'custom-appointment-overlay'"
  cancelLabel="Discard"
  okLabel="Set Meeting"
  (timeSet)="onMeetingConfirmed($event)"
/>
```

### Recipe 3: Native JavaScript `Date` and Timezone Preservation
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
  <ngx-mat-timepicker #picker (dateSet)="onDateConfirmed($event)" />
</mat-form-field>
```

### Recipe 4: Inline Embedded Dialog (No Modal Overlay)
```html
<ngx-mat-timepicker-dialog
  [initialTime]="timeModel"
  [format]="12"
  orientation="horizontal"
  (timeSet)="onInlineTimeSet($event)"
/>
```

### Recipe 5: Programmatic Opening via Button
```html
<button type="button" (click)="picker.open('08:45 AM')">
  Set Alarm
</button>
<ngx-mat-timepicker #picker [format]="12" (timeSet)="saveAlarm($event)" />
```
